const Earning = require('./earning.model');

/**
 * Get earnings — admin sees all, individual sees own
 */
const getEarnings = async (userRole, userId, filters = {}) => {
  const query = {};

  // Non-admin users can only see their own earnings
  if (userRole !== 'admin' && userRole !== 'superadmin') {
    query.staffId = userId;
  }

  // Filter by role (driver / doctor / kitchen)
  if (filters.staffRole && filters.staffRole !== 'all') {
    if (filters.staffRole === 'delivery' || filters.staffRole === 'driver') {
      query.staffRole = { $in: ['delivery', 'driver'] };
    } else {
      query.staffRole = filters.staffRole;
    }
  }

  // Filter by status
  if (filters.status && filters.status !== 'all') {
    query.status = filters.status;
  }

  if (filters.search) {
    const User = require('../user/user.model');
    const matchedUsers = await User.find({
      name: { $regex: filters.search, $options: 'i' }
    }).select('_id');
    const userIds = matchedUsers.map(u => u._id);
    query.staffId = { $in: userIds };
  }

  const page = parseInt(filters.page, 10) || 1;
  const limit = parseInt(filters.limit, 10) || 10;
  const skip = (page - 1) * limit;

  // Compute totals across all matches (before pagination)
  const allMatches = await Earning.find(query).lean();
  const totalEarned = allMatches.reduce((acc, e) => acc + e.amount, 0);
  const pendingAmount = allMatches.filter(e => e.status === 'pending').reduce((acc, e) => acc + e.amount, 0);
  const paidAmount = totalEarned - pendingAmount;

  // Get paginated earnings
  const earnings = await Earning.find(query)
    .populate('staffId', 'name phone email')
    .populate('orderId', 'createdAt status totalAmount')
    .populate('appointmentId', 'date time status')
    .sort('-createdAt')
    .skip(skip)
    .limit(limit);

  return { earnings, totalEarned, pendingAmount, paidAmount, count: allMatches.length };
};

/**
 * Mark a single earning as paid
 */
const markAsPaid = async (earningId) => {
  const earning = await Earning.findByIdAndUpdate(
    earningId,
    { status: 'paid' },
    { new: true }
  ).populate('staffId', 'name');
  if (!earning) throw new Error('Earning not found');
  return earning;
};

/**
 * Manually create a payout entry (admin logs a payout)
 */
const createEarning = async (earningData) => {
  const { staffId, staffRole, orderId, appointmentId, amount, notes } = earningData;
  const earning = await Earning.create({
    staffId, staffRole, orderId, appointmentId, amount, notes
  });
  return earning.populate('staffId', 'name');
};

/**
 * Delete a payout entry (admin only, if pending)
 */
const deleteEarning = async (earningId) => {
  const earning = await Earning.findById(earningId);
  if (!earning) throw new Error('Earning not found');
  
  // We can enforce that only 'pending' can be deleted if needed, or leave it to admin discretion
  await earning.deleteOne();
  return true;
};

/**
 * Update a payout entry (admin only)
 */
const updateEarning = async (earningId, updateData) => {
  const earning = await Earning.findByIdAndUpdate(earningId, updateData, {
    new: true,
    runValidators: true
  }).populate('staffId', 'name');
  if (!earning) throw new Error('Earning not found');
  return earning;
};

module.exports = {
  getEarnings,
  markAsPaid,
  createEarning,
  deleteEarning,
  updateEarning
};

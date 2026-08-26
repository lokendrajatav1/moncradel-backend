const earningService = require('./earning.service');

// @desc    Get earnings (admin sees all, staff sees own)
// @route   GET /api/earnings?staffRole=driver|doctor|kitchen&status=pending|paid
// @access  Private
const getEarnings = async (req, res, next) => {
  try {
    const allowedRoles = ['admin', 'superadmin', 'delivery', 'doctor', 'kitchen'];
    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }
    const filters = {
      staffRole: req.query.staffRole,
      status: req.query.status,
      search: req.query.search,
      staffId: req.query.staffId,
      page: req.query.page,
      limit: req.query.limit
    };
    const result = await earningService.getEarnings(req.user.role, req.user._id, filters);
    res.status(200).json({
      success: true,
      count: result.count,
      totalEarned: result.totalEarned,
      pendingAmount: result.pendingAmount,
      paidAmount: result.paidAmount,
      data: result.earnings
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Mark a single earning as paid
// @route   PATCH /api/earnings/:id/pay
// @access  Private (Admin)
const markAsPaid = async (req, res, next) => {
  try {
    if (req.user.role !== 'admin' && req.user.role !== 'superadmin') {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }
    const earning = await earningService.markAsPaid(req.params.id);
    res.status(200).json({ success: true, data: earning });
  } catch (error) {
    if (error.message === 'Earning not found') {
      return res.status(404).json({ success: false, message: 'Earning not found' });
    }
    next(error);
  }
};

// @desc    Admin manually create a payout record
// @route   POST /api/earnings
// @access  Private (Admin)
const createEarning = async (req, res, next) => {
  try {
    if (req.user.role !== 'admin' && req.user.role !== 'superadmin') {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }
    const earning = await earningService.createEarning(req.body);
    res.status(201).json({ success: true, data: earning });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a payout record
// @route   DELETE /api/earnings/:id
// @access  Private (Admin)
const deleteEarning = async (req, res, next) => {
  try {
    if (req.user.role !== 'admin' && req.user.role !== 'superadmin') {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }
    await earningService.deleteEarning(req.params.id);
    res.status(200).json({ success: true, message: 'Payout deleted successfully' });
  } catch (error) {
    if (error.message === 'Earning not found') {
      return res.status(404).json({ success: false, message: 'Earning not found' });
    }
    next(error);
  }
};

// @desc    Update a payout record
// @route   PUT /api/earnings/:id
// @access  Private (Admin)
const updateEarning = async (req, res, next) => {
  try {
    if (req.user.role !== 'admin' && req.user.role !== 'superadmin') {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }
    const earning = await earningService.updateEarning(req.params.id, req.body);
    res.status(200).json({ success: true, data: earning });
  } catch (error) {
    if (error.message === 'Earning not found') {
      return res.status(404).json({ success: false, message: 'Earning not found' });
    }
    next(error);
  }
};

module.exports = {
  getEarnings,
  markAsPaid,
  createEarning,
  deleteEarning,
  updateEarning
};

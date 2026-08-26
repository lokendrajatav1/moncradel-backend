const Withdrawal = require('./withdrawal.model');
const Earning = require('../earning/earning.model');
const mongoose = require('mongoose');

/**
 * Request a withdrawal for a doctor
 */
const requestWithdrawal = async (doctorId, amount) => {
  const doctorObjectId = new mongoose.Types.ObjectId(doctorId);

  // 1. Calculate Available Balance
  // Total Earned (pending or paid)
  const earningsAgg = await Earning.aggregate([
    { $match: { staffId: doctorObjectId, staffRole: 'doctor' } },
    { $group: { _id: null, totalEarned: { $sum: '$amount' } } }
  ]);
  const totalEarned = earningsAgg[0]?.totalEarned || 0;

  // Withdrawals (pending or approved)
  const withdrawalsAgg = await Withdrawal.aggregate([
    { $match: { doctorId: doctorObjectId, status: { $in: ['pending', 'approved'] } } },
    { $group: { _id: null, totalWithdrawn: { $sum: '$amount' } } }
  ]);
  const totalWithdrawn = withdrawalsAgg[0]?.totalWithdrawn || 0;

  const availableBalance = totalEarned - totalWithdrawn;

  if (amount > availableBalance) {
    throw new Error(`Insufficient available balance. You can withdraw up to ₹${availableBalance}`);
  }

  // 2. Create Withdrawal Request
  const withdrawal = await Withdrawal.create({
    doctorId,
    amount,
    status: 'pending'
  });

  return withdrawal;
};

/**
 * Get withdrawal history for a doctor
 */
const getDoctorWithdrawals = async (doctorId) => {
  const withdrawals = await Withdrawal.find({ doctorId })
    .sort('-createdAt')
    .lean();
  return withdrawals;
};

/**
 * Update withdrawal status (for Admin)
 */
const updateWithdrawalStatus = async (withdrawalId, status) => {
  const withdrawal = await Withdrawal.findByIdAndUpdate(
    withdrawalId,
    { status },
    { new: true }
  );
  if (!withdrawal) {
    throw new Error('Withdrawal request not found');
  }
  return withdrawal;
};

module.exports = {
  requestWithdrawal,
  getDoctorWithdrawals,
  updateWithdrawalStatus
};

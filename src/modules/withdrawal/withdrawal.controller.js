const withdrawalService = require('./withdrawal.service');

// @desc    Request a withdrawal
// @route   POST /api/withdrawal
// @access  Private (Doctor)
const requestWithdrawal = async (req, res, next) => {
  try {
    const { amount } = req.body;
    
    if (!amount || amount < 100) {
      return res.status(400).json({ success: false, message: 'Minimum withdrawal amount is ₹100' });
    }

    const withdrawal = await withdrawalService.requestWithdrawal(req.user._id, amount);

    res.status(201).json({
      success: true,
      message: 'Withdrawal request submitted successfully',
      data: withdrawal
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get doctor's withdrawal history
// @route   GET /api/withdrawal
// @access  Private (Doctor)
const getDoctorWithdrawals = async (req, res, next) => {
  try {
    const withdrawals = await withdrawalService.getDoctorWithdrawals(req.user._id);

    res.status(200).json({
      success: true,
      data: withdrawals
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  requestWithdrawal,
  getDoctorWithdrawals
};

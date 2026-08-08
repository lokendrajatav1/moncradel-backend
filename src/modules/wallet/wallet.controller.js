const walletService = require('./wallet.service');

// @desc    Get user wallet
// @route   GET /api/wallet
// @access  Private
const getWallet = async (req, res, next) => {
  try {
    const wallet = await walletService.getWalletByUserId(req.user._id);
    res.status(200).json({ success: true, data: wallet });
  } catch (error) {
    next(error);
  }
};

// @desc    Add funds to wallet (or deduct)
// @route   POST /api/wallet/transaction
// @access  Private (Internal/Admin)
const createTransaction = async (req, res, next) => {
  try {
    const { userId, type, amount, description } = req.body;
    
    // In real app, only Admin or internal webhook should call this directly. 
    // Here we will just do a simple check.
    if (req.user.role !== 'admin' && req.user._id.toString() !== userId) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    const wallet = await walletService.createTransaction(req.body);

    res.status(200).json({ success: true, data: wallet });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getWallet,
  createTransaction
};

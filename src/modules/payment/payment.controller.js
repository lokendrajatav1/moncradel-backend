const paymentService = require('./payment.service');

// @desc    Create a payment intent/record
// @route   POST /api/payments
// @access  Private
const createPayment = async (req, res, next) => {
  try {
    const payment = await paymentService.createPayment(req.user._id, req.body);
    res.status(201).json({ success: true, data: payment });
  } catch (error) {
    next(error);
  }
};

// @desc    Verify payment (Webhook simulator)
// @route   PATCH /api/payments/:id/verify
// @access  Private
const verifyPayment = async (req, res, next) => {
  try {
    const io = req.app.get('io');
    const payment = await paymentService.verifyPayment(req.params.id, req.body, io);
    res.status(200).json({ success: true, data: payment });
  } catch (error) {
    if (error.message === 'Payment not found') {
      return res.status(404).json({ success: false, message: 'Payment not found' });
    }
    next(error);
  }
};

module.exports = {
  createPayment,
  verifyPayment
};

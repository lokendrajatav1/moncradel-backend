const Payment = require('./payment.model');

/**
 * Create a new payment intent/record
 */
const createPayment = async (userId, paymentData) => {
  const { amount, orderId, subscriptionId } = paymentData;

  const payment = await Payment.create({
    userId,
    amount,
    orderId,
    subscriptionId,
    status: 'pending'
  });

  return payment;
};

/**
 * Verify a payment (e.g. from webhook)
 */
const verifyPayment = async (paymentId, verificationData, io) => {
  const { status, transactionId } = verificationData;
  
  const payment = await Payment.findByIdAndUpdate(
    paymentId,
    { status, transactionId },
    { new: true }
  );

  if (!payment) {
    throw new Error('Payment not found');
  }

  // Emit socket event to the user if socket.io is initialized
  if (io) {
    io.to(`user_${payment.userId}`).emit('payment_status', { paymentId: payment._id, status });
  }

  return payment;
};

/**
 * Get all payments (admin)
 */
const getPayments = async (filters = {}) => {
  const { status, search, page = 1, limit = 20 } = filters;
  const query = {};

  if (status && status !== 'all') query.status = status;

  const skip = (page - 1) * limit;

  let paymentsQuery = Payment.find(query)
    .populate('userId', 'name email phone')
    .populate('orderId', 'totalAmount')
    .sort('-createdAt')
    .skip(skip)
    .limit(Number(limit));

  const [payments, total] = await Promise.all([
    paymentsQuery,
    Payment.countDocuments(query)
  ]);

  const totalRevenue = await Payment.aggregate([
    { $match: { status: 'success' } },
    { $group: { _id: null, total: { $sum: '$amount' } } }
  ]);

  return {
    payments,
    total,
    totalRevenue: totalRevenue[0]?.total || 0
  };
};

module.exports = {
  createPayment,
  verifyPayment,
  getPayments
};

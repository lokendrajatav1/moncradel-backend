const paymentService = require('./payment.service');
const crypto = require('crypto');
const Order = require('../order/order.model');
const Subscription = require('../subscription/subscription.model');
const orderService = require('../order/order.service');
const eventEmitter = require('../../events/eventEmitter');

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

// @desc    Get all payments (admin)
// @route   GET /api/payments
// @access  Private/Admin
const getPayments = async (req, res, next) => {
  try {
    const filters = {
      status: req.query.status,
      search: req.query.search,
      page: parseInt(req.query.page) || 1,
      limit: parseInt(req.query.limit) || 20
    };
    
    const result = await paymentService.getPayments(filters);
    res.status(200).json({ 
      success: true, 
      data: result.payments, 
      total: result.total, 
      totalRevenue: result.totalRevenue 
    });
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

// @desc    Initiate PhonePe Payment
// @route   POST /api/payments/initiate
// @access  Private
const initiatePayment = async (req, res, next) => {
  try {
    const { orderId, subscriptionId } = req.body;
    if (!orderId && !subscriptionId) {
      return res.status(400).json({ success: false, message: 'Order ID or Subscription ID is required' });
    }

    let targetDoc;
    let paymentData = {};
    let redirectUrl = '';

    if (orderId) {
      targetDoc = await Order.findById(orderId);
      if (!targetDoc) return res.status(404).json({ success: false, message: 'Order not found' });
      paymentData = { amount: targetDoc.totalAmount, orderId: targetDoc._id };
    } else if (subscriptionId) {
      targetDoc = await Subscription.findById(subscriptionId);
      if (!targetDoc) return res.status(404).json({ success: false, message: 'Subscription not found' });
      paymentData = { amount: targetDoc.totalAmount, subscriptionId: targetDoc._id };
    }

    // Create a pending payment record
    const payment = await paymentService.createPayment(req.user._id, paymentData);

    const merchantId = process.env.PHONEPE_MERCHANT_ID;
    const saltKey = process.env.PHONEPE_SALT_KEY;
    const saltIndex = process.env.PHONEPE_SALT_INDEX;
    
    const frontendUrl = process.env.FRONTEND_URL;
    const backendUrl = process.env.BACKEND_URL;

    if (!merchantId || !saltKey || !frontendUrl || !backendUrl) {
      return res.status(500).json({ success: false, message: 'Payment gateway configuration is missing' });
    }

    // Front-end redirect URL
    redirectUrl = `${frontendUrl}/shop/order-success?paymentId=${payment._id}${subscriptionId ? '&type=subscription' : ''}`; 
    // Backend webhook callback URL
    const callbackUrl = `${backendUrl}/api/payments/callback`;

    const payload = {
      merchantId: merchantId,
      merchantTransactionId: payment._id.toString(),
      merchantUserId: req.user._id.toString(),
      amount: Math.round(targetDoc.totalAmount * 100), // Amount in paise, must be integer
      redirectUrl: redirectUrl,
      redirectMode: 'REDIRECT',
      callbackUrl: callbackUrl,
      paymentInstrument: {
        type: 'PAY_PAGE'
      }
    };

    const base64Payload = Buffer.from(JSON.stringify(payload)).toString('base64');
    const dataToHash = base64Payload + '/pg/v1/pay' + saltKey;
    const checksum = crypto.createHash('sha256').update(dataToHash).digest('hex') + '###' + saltIndex;

    const phonePeUrl = process.env.PHONEPE_BASE_URL;

    const response = await fetch(phonePeUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-VERIFY': checksum
      },
      body: JSON.stringify({ request: base64Payload })
    });

    const responseData = await response.json();

    if (responseData.success) {
      return res.status(200).json({
        success: true,
        redirectUrl: responseData.data.instrumentResponse.redirectInfo.url,
        paymentId: payment._id
      });
    } else {
      return res.status(400).json({ success: false, message: 'Failed to initiate payment with PhonePe', error: responseData });
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Handle PhonePe S2S Callback
// @route   POST /api/payments/callback
// @access  Public
const handlePhonePeCallback = async (req, res) => {
  try {
    const responsePayload = req.body.response;
    if (!responsePayload) {
      return res.status(400).send('Invalid payload');
    }

    const saltKey = process.env.PHONEPE_SALT_KEY;
    const saltIndex = process.env.PHONEPE_SALT_INDEX;

    if (!saltKey || !saltIndex) {
      console.error('PhonePe config missing for callback');
      return res.status(500).send('Server configuration error');
    }

    const receivedChecksum = req.headers['x-verify'];
    const calculatedChecksum = crypto.createHash('sha256').update(responsePayload + saltKey).digest('hex') + '###' + saltIndex;

    if (receivedChecksum !== calculatedChecksum) {
      console.error('Invalid PhonePe checksum');
      return res.status(400).send('Invalid signature');
    }

    const decodedPayload = JSON.parse(Buffer.from(responsePayload, 'base64').toString('utf8'));

    const merchantTransactionId = decodedPayload.data.merchantTransactionId;
    const phonePeTransactionId = decodedPayload.data.transactionId;
    const amount = decodedPayload.data.amount / 100;
    const status = decodedPayload.code === 'PAYMENT_SUCCESS' ? 'success' : 'failed';

    const io = req.app.get('io');
    const payment = await paymentService.verifyPayment(merchantTransactionId, {
      status,
      transactionId: phonePeTransactionId
    }, io);

    // Update order payment status
    if (payment.orderId) {
      await Order.findByIdAndUpdate(payment.orderId, {
        paymentStatus: status === 'success' ? 'paid' : 'failed'
      });
      if (status === 'failed') {
        await orderService.restoreProductStock(payment.orderId);
      } else if (status === 'success') {
        // Now notify the kitchen that a prepaid order has been paid and should be prepared
        const orderDoc = await Order.findById(payment.orderId);
        if (orderDoc) {
          const io = req.app.get('io');
          if (io) {
            io.emit('new_order', { orderId: orderDoc._id, mealId: orderDoc.mealId, status: 'pending' });
          }
        }
      }
    } else if (payment.subscriptionId && status === 'success') {
      const subDoc = await Subscription.findById(payment.subscriptionId);
      if (subDoc) {
        eventEmitter.emit('subscription.created', { subscription: subDoc, user: { _id: payment.userId } });
      }
    }

    res.status(200).send('OK');
  } catch (error) {
    console.error('PhonePe Webhook Error:', error);
    res.status(500).send('Webhook Processing Error');
  }
};

// @desc    Check Payment Status with PhonePe
// @route   GET /api/payments/status/:id
// @access  Private
const checkPaymentStatus = async (req, res, next) => {
  try {
    const paymentId = req.params.id;
    const payment = await paymentService.getPayments({ _id: paymentId });
    if (!payment || payment.payments.length === 0) {
      return res.status(404).json({ success: false, message: 'Payment not found' });
    }
    const paymentRecord = payment.payments[0];

    const merchantId = process.env.PHONEPE_MERCHANT_ID;
    const saltKey = process.env.PHONEPE_SALT_KEY;
    const saltIndex = process.env.PHONEPE_SALT_INDEX;

    const endpoint = `/pg/v1/status/${merchantId}/${paymentId}`;
    const checksum = crypto.createHash('sha256').update(endpoint + saltKey).digest('hex') + '###' + saltIndex;
    
    // Defaulting to hermes endpoint for UAT
    const phonePeUrl = `https://api-preprod.phonepe.com/apis/hermes${endpoint}`;

    const response = await fetch(phonePeUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'X-VERIFY': checksum,
        'X-MERCHANT-ID': merchantId
      }
    });

    const responseData = await response.json();

    if (responseData.success && responseData.code === 'PAYMENT_SUCCESS') {
      const io = req.app.get('io');
      const updatedPayment = await paymentService.verifyPayment(paymentId, {
        status: 'success',
        transactionId: responseData.data.transactionId
      }, io);

      if (updatedPayment.orderId) {
        await Order.findByIdAndUpdate(updatedPayment.orderId, { paymentStatus: 'paid' });
        // Notify kitchen that this prepaid order is now paid
        const orderDoc = await Order.findById(updatedPayment.orderId);
        if (orderDoc) {
          const io = req.app.get('io');
          if (io) {
            io.emit('new_order', { orderId: orderDoc._id, mealId: orderDoc.mealId, status: 'pending' });
          }
        }
      } else if (updatedPayment.subscriptionId) {
        const subDoc = await Subscription.findById(updatedPayment.subscriptionId);
        if (subDoc) {
          eventEmitter.emit('subscription.created', { subscription: subDoc, user: { _id: updatedPayment.userId } });
        }
      }

      return res.status(200).json({ success: true, status: 'success' });
    } else {
      // Update as failed in DB
      const io = req.app.get('io');
      const updatedPayment = await paymentService.verifyPayment(paymentId, {
        status: 'failed',
        transactionId: responseData.data ? responseData.data.transactionId : undefined
      }, io);

      if (updatedPayment.orderId) {
        await Order.findByIdAndUpdate(updatedPayment.orderId, { paymentStatus: 'failed' });
        await orderService.restoreProductStock(updatedPayment.orderId);
      }

      return res.status(200).json({ success: true, status: 'failed', message: responseData.message });
    }
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createPayment,
  verifyPayment,
  getPayments,
  initiatePayment,
  handlePhonePeCallback,
  checkPaymentStatus
};

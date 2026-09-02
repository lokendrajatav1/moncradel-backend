const express = require('express');
const router = express.Router();
const { createPayment, verifyPayment, getPayments, initiatePayment, handlePhonePeCallback, checkPaymentStatus } = require('./payment.controller');
const { protect } = require('../../middleware/auth');
const validate = require('../../middleware/validate');
const { createPaymentSchema, verifyPaymentSchema } = require('./payment.validation');

router.post('/initiate', protect, initiatePayment);
router.post('/callback', handlePhonePeCallback);

router.route('/')
  .post(protect, validate(createPaymentSchema), createPayment)
  .get(protect, getPayments);

router.route('/:id/verify')
  .patch(protect, validate(verifyPaymentSchema), verifyPayment);

router.get('/status/:id', protect, checkPaymentStatus);

module.exports = router;

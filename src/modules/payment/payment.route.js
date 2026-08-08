const express = require('express');
const router = express.Router();
const { createPayment, verifyPayment } = require('./payment.controller');
const { protect } = require('../../middleware/auth');
const validate = require('../../middleware/validate');
const { createPaymentSchema, verifyPaymentSchema } = require('./payment.validation');

router.route('/')
  .post(protect, validate(createPaymentSchema), createPayment);

router.route('/:id/verify')
  .patch(protect, validate(verifyPaymentSchema), verifyPayment);

module.exports = router;

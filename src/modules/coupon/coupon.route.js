const express = require('express');
const router = express.Router();
const { createCoupon, applyCoupon, getCoupons, updateCoupon, deleteCoupon } = require('./coupon.controller');
const { protect } = require('../../middleware/auth');
const validate = require('../../middleware/validate');
const { couponSchema, updateSchema, applySchema } = require('./coupon.validation');

router.route('/')
  .post(protect, validate(couponSchema), createCoupon)
  .get(protect, getCoupons);

router.route('/apply')
  .post(protect, validate(applySchema), applyCoupon);

router.route('/:id')
  .put(protect, validate(updateSchema), updateCoupon)
  .delete(protect, deleteCoupon);

module.exports = router;

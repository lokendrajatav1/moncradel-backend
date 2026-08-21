const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../../middleware/auth');

const { createOrder, getOrders, getOrderById, updateOrderStatus } = require('./order.controller');
const validate = require('../../middleware/validate');
const { createOrderSchema, updateOrderSchema } = require('./order.validation');
const upload = require('../../middleware/upload');

// Routes protected to ensure req.user is available for role checks
router.route('/')
  .post(protect, validate(createOrderSchema), createOrder)
  .get(protect, getOrders);

router.route('/:id')
  .get(protect, getOrderById);

router.route('/:id/status')
  .patch(protect, validate(updateOrderSchema), upload.single('proof'), updateOrderStatus);

module.exports = router;

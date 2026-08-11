const express = require('express');
const router = express.Router();
const { getCart, addToCart, clearCart, removeItem, updateQuantity } = require('./cart.controller');
const { protect } = require('../../middleware/auth');
const validate = require('../../middleware/validate');
const { addSchema } = require('./cart.validation');

router.route('/')
  .get(protect, getCart)
  .post(protect, validate(addSchema), addToCart)
  .delete(protect, clearCart);

router.route('/:itemId')
  .delete(protect, removeItem)
  .patch(protect, updateQuantity);

module.exports = router;

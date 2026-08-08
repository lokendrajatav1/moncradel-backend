const cartService = require('./cart.service');

// @desc    Get user cart
// @route   GET /api/cart
// @access  Private (Parent)
const getCart = async (req, res, next) => {
  try {
    const cart = await cartService.getCartByUserId(req.user._id);
    res.status(200).json({ success: true, data: cart });
  } catch (error) {
    next(error);
  }
};

// @desc    Add item to cart
// @route   POST /api/cart
// @access  Private (Parent)
const addToCart = async (req, res, next) => {
  try {
    const cart = await cartService.addToCart(req.user._id, req.body);
    res.status(200).json({ success: true, data: cart });
  } catch (error) {
    // If it's a known error from service (e.g. "Meal not found") we could format it
    // For now passing to global error handler
    if (error.message === 'Meal not found' || error.message === 'Product not found') {
      return res.status(404).json({ success: false, message: error.message });
    }
    if (error.message === 'Insufficient stock') {
      return res.status(400).json({ success: false, message: error.message });
    }
    next(error);
  }
};

// @desc    Clear cart
// @route   DELETE /api/cart
// @access  Private (Parent)
const clearCart = async (req, res, next) => {
  try {
    const cart = await cartService.clearCart(req.user._id);
    res.status(200).json({ success: true, data: cart });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getCart,
  addToCart,
  clearCart
};

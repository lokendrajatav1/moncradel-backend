const cartService = require('./cart.service');

const getCart = async (req, res, next) => {
  try {
    const cart = await cartService.getCartByUserId(req.user._id);
    res.status(200).json({ success: true, data: cart });
  } catch (error) { next(error); }
};

const addToCart = async (req, res, next) => {
  try {
    const cart = await cartService.addToCart(req.user._id, req.body);
    res.status(200).json({ success: true, data: cart });
  } catch (error) {
    if (['Meal not found','Product not found'].includes(error.message))
      return res.status(404).json({ success: false, message: error.message });
    if (error.message === 'Insufficient stock')
      return res.status(400).json({ success: false, message: error.message });
    next(error);
  }
};

const clearCart = async (req, res, next) => {
  try {
    const cart = await cartService.clearCart(req.user._id);
    res.status(200).json({ success: true, data: cart });
  } catch (error) { next(error); }
};

const removeItem = async (req, res, next) => {
  try {
    const cart = await cartService.removeItem(req.user._id, req.params.itemId);
    res.status(200).json({ success: true, data: cart });
  } catch (error) { next(error); }
};

const updateQuantity = async (req, res, next) => {
  try {
    const cart = await cartService.updateItemQuantity(req.user._id, req.params.itemId, req.body.quantity);
    res.status(200).json({ success: true, data: cart });
  } catch (error) { next(error); }
};

module.exports = { getCart, addToCart, clearCart, removeItem, updateQuantity };

const Cart = require('./cart.model');
const Meal = require('../meal/meal.model');
const Product = require('../product/product.model');

/**
 * Get user cart, creating it if it doesn't exist
 */
const getCartByUserId = async (userId) => {
  let cart = await Cart.findOne({ userId })
    .populate('items.mealId', 'name imageUrl price')
    .populate('items.productId', 'name imageUrl price stockQuantity');

  if (!cart) {
    cart = await Cart.create({ userId, items: [], totalPrice: 0 });
  }

  return cart;
};

/**
 * Add an item to the cart
 */
const addToCart = async (userId, itemData) => {
  const { itemType, itemId, quantity } = itemData;
  
  let price = 0;
  if (itemType === 'meal') {
    const meal = await Meal.findById(itemId);
    if (!meal) throw new Error('Meal not found');
    price = meal.price || 0; 
  } else if (itemType === 'product') {
    const product = await Product.findById(itemId);
    if (!product) throw new Error('Product not found');
    if (product.stockQuantity < quantity) throw new Error('Insufficient stock');
    price = product.price || 0;
  }

  let cart = await Cart.findOne({ userId });
  if (!cart) {
    cart = await Cart.create({ userId, items: [], totalPrice: 0 });
  }

  // Check if item already exists in cart
  const existingItemIndex = cart.items.findIndex(item => 
    (itemType === 'meal' && item.mealId?.toString() === itemId) || 
    (itemType === 'product' && item.productId?.toString() === itemId)
  );

  if (existingItemIndex > -1) {
    cart.items[existingItemIndex].quantity += quantity;
  } else {
    const newItem = {
      itemType,
      quantity,
      priceAtAddition: price
    };
    if (itemType === 'meal') newItem.mealId = itemId;
    if (itemType === 'product') newItem.productId = itemId;
    
    cart.items.push(newItem);
  }

  // Recalculate total
  cart.totalPrice = cart.items.reduce((total, item) => total + (item.priceAtAddition * item.quantity), 0);
  
  await cart.save();
  return cart;
};

/**
 * Clear the entire cart
 */
const clearCart = async (userId) => {
  return await Cart.findOneAndUpdate(
    { userId },
    { items: [], totalPrice: 0 },
    { new: true }
  );
};

module.exports = {
  getCartByUserId,
  addToCart,
  clearCart
};

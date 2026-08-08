const Order = require('./order.model');
const Meal = require('../meal/meal.model');
const Product = require('../product/product.model');
const APIFeatures = require('../../utils/apiFeatures');

/**
 * Create a new order
 */
const createOrder = async (orderData, parentId) => {
  let finalPrice = 0;

  if (orderData.mealId) {
    const meal = await Meal.findById(orderData.mealId);
    if (meal) {
      finalPrice = (meal.discountedPrice && meal.discountedPrice > 0) ? meal.discountedPrice : meal.price;
    }
  } else if (orderData.productId) {
    const product = await Product.findById(orderData.productId);
    if (product) {
      finalPrice = (product.discountedPrice && product.discountedPrice > 0) ? product.discountedPrice : product.price;
    }
  }

  let isOtpRequired = false;
  let deliveryOtp = undefined;

  // Rule: OTP required if it's a product OR total price >= 1000
  if (orderData.productId || finalPrice >= 1000) {
    isOtpRequired = true;
    deliveryOtp = Math.floor(1000 + Math.random() * 9000).toString(); // 4-digit OTP
  }

  const order = await Order.create({
    ...orderData,
    parentId,
    totalAmount: finalPrice,
    isOtpRequired,
    deliveryOtp
  });
  return order;
};

/**
 * Get orders with filters and populate relations
 */
const getOrders = async (filters = {}, queryString = {}) => {
  const features = new APIFeatures(Order.find(filters), queryString)
    .filter();
    
  // Clone query to get total count before sorting and paginating
  const countQuery = features.query.clone();
  const totalCount = await countQuery.countDocuments();

  features.sort().paginate();

  const data = await features.query
    .populate('parentId', 'name email phone')
    .populate('babyId', 'name ageInMonths allergies')
    .populate('mealId', 'name price imageUrl nutritionalInfo discountedPrice')
    .populate('productId', 'name price imageUrl discountedPrice')
    .populate('kitchenId', 'name phone')
    .populate('deliveryId', 'name phone');

  return { totalCount, data };
};

/**
 * Update order status
 */
const updateOrderStatus = async (orderId, status, updatedFields = {}) => {
  return await Order.findByIdAndUpdate(
    orderId,
    { status, ...updatedFields },
    { new: true }
  );
};

module.exports = {
  createOrder,
  getOrders,
  updateOrderStatus
};

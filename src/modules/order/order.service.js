const Order = require('./order.model');
const Meal = require('../meal/meal.model');
const Product = require('../product/product.model');
const APIFeatures = require('../../utils/apiFeatures');
const couponService = require('../coupon/coupon.service');

/**
 * Create a new order
 */
const createOrder = async (orderData, parentId) => {
  let finalPrice = 0;
  let hasProduct = false;

  for (const item of orderData.items || []) {
    if (item.itemType === 'product') hasProduct = true;
    finalPrice += (item.priceAtAddition || 0) * (item.quantity || 1);
  }

  let discountAmount = 0;
  let appliedCouponCode = '';

  if (orderData.couponCode) {
    try {
      const couponResult = await couponService.applyCoupon(orderData.couponCode, finalPrice);
      discountAmount = couponResult.discountAmount;
      finalPrice = couponResult.finalAmount;
      appliedCouponCode = orderData.couponCode;
    } catch (err) {
      console.error('Failed to apply coupon during order creation', err);
      throw new Error(err.message || 'Failed to apply coupon');
    }
  }

  let isOtpRequired = false;
  let deliveryOtp = undefined;

  // Rule: OTP required if it contains a product OR total price >= 1000
  if (hasProduct || finalPrice >= 1000) {
    isOtpRequired = true;
    deliveryOtp = Math.floor(1000 + Math.random() * 9000).toString(); // 4-digit OTP
  }

  const order = await Order.create({
    ...orderData,
    parentId,
    totalAmount: finalPrice,
    couponCode: appliedCouponCode,
    discountAmount: discountAmount,
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
    .populate('items.mealId', 'name price imageUrl nutritionalInfo discountedPrice')
    .populate('items.productId', 'name price imageUrl discountedPrice')
    .populate('kitchenId', 'name phone address')
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

/**
 * Get single order by ID
 */
const getOrderById = async (orderId) => {
  return await Order.findById(orderId)
    .populate('parentId', 'name email phone')
    .populate('babyId', 'name ageInMonths allergies')
    .populate('items.mealId', 'name price imageUrl nutritionalInfo discountedPrice')
    .populate('items.productId', 'name price imageUrl discountedPrice')
    .populate('kitchenId', 'name phone address')
    .populate('deliveryId', 'name phone');
};

module.exports = {
  createOrder,
  getOrders,
  getOrderById,
  updateOrderStatus
};

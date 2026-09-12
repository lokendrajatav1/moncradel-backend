const Order = require('./order.model');
const Meal = require('../meal/meal.model');
const Product = require('../product/product.model');
const APIFeatures = require('../../utils/apiFeatures');
const couponService = require('../coupon/coupon.service');

/**
 * Create a new order
 */
const createOrder = async (orderData, parentId) => {
  const subscriptionService = require('../subscription/subscription.service');

  let finalPrice = 0;
  let hasProduct = false;

  const regularItems = [];
  let subscriptionSchedules = [];

  // Validate and deduct stock for products
  for (const item of orderData.items || []) {
    if (item.itemType === 'product') {
      hasProduct = true;
      const product = await Product.findById(item.productId);
      if (!product) {
        throw new Error(`Product not found`);
      }
      if (product.stockQuantity < (item.quantity || 1)) {
        throw new Error(`Product ${product.name} is out of stock`);
      }
      // Deduct stock for immediate products (not future subscription deliveries)
      if (!item.isSubscription) {
        product.stockQuantity -= (item.quantity || 1);
        await product.save();
      }
    }

    if (item.isSubscription && item.deliveryDates && item.deliveryDates.length > 0) {
      // Calculate total price for this subscription item based on number of deliveries
      finalPrice += (item.priceAtAddition || 0) * (item.quantity || 1) * item.deliveryDates.length;
      
      // Expand into schedule
      for (const dateStr of item.deliveryDates) {
        // If quantity is > 1, add multiple schedule entries or handle it in schedule.
        // We will just add one schedule entry but what if quantity is 2?
        // Let's create multiple schedule entries for each quantity, or assume quantity applies per date.
        // To be safe, we push a single schedule object and if they want 2 meals, they get 2 schedule entries.
        for(let q = 0; q < (item.quantity || 1); q++) {
          subscriptionSchedules.push({
            date: new Date(dateStr),
            mealId: item.mealId,
            productId: item.productId,
            timeSlot: item.timeSlot,
            specialInstructions: item.specialInstructions,
            status: 'pending'
          });
        }
      }
    } else {
      finalPrice += (item.priceAtAddition || 0) * (item.quantity || 1);
      regularItems.push(item);
    }
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

  // Fetch admin-configured shipping and GST settings
  // Defaults are 0 — no charges applied until admin configures them
  let shippingFee = 0;
  let freeThreshold = 0;
  let gstRate = 0;
  try {
    const Setting = require('../setting/setting.model');
    const [baseFeeS, freeThreshS, gstRateS] = await Promise.all([
      Setting.findOne({ key: 'base_delivery_fee' }),
      Setting.findOne({ key: 'free_delivery_threshold' }),
      Setting.findOne({ key: 'gst_rate' })
    ]);
    if (baseFeeS?.value) shippingFee = parseFloat(baseFeeS.value);
    if (freeThreshS?.value) freeThreshold = parseFloat(freeThreshS.value);
    if (gstRateS?.value) gstRate = parseFloat(gstRateS.value);
  } catch (e) {
    console.error('Could not load settings, using defaults', e);
  }

  // If freeThreshold is 0 (not set), shipping is always free
  const shipping = freeThreshold > 0 && finalPrice < freeThreshold ? shippingFee : 0;
  const taxAmount = parseFloat(((finalPrice * gstRate) / 100).toFixed(2));
  const grandTotal = Math.round(finalPrice + shipping + taxAmount);

  let isOtpRequired = false;
  let deliveryOtp = undefined;

  // Rule: OTP required if it contains a product OR total price >= 1000
  if (hasProduct || grandTotal >= 1000) {
    isOtpRequired = true;
    deliveryOtp = Math.floor(1000 + Math.random() * 9000).toString(); // 4-digit OTP
  }

  let createdSubscription = null;

  if (subscriptionSchedules.length > 0) {
    // If they have subscriptions, we need babyId. If not provided, fetch first baby for the user
    let babyId = orderData.babyId;
    if (!babyId) {
       const Baby = require('../baby/baby.model');
       const baby = await Baby.findOne({ parentId });
       if (baby) {
         babyId = baby._id;
       } else {
         // Create a dummy baby profile if none exists, as Subscription requires it
         const newBaby = await Baby.create({ parentId, name: 'My Baby', ageInMonths: 12 });
         babyId = newBaby._id;
       }
    }

    let addressId = null;
    if (orderData.deliveryAddress) {
       const Address = require('../address/address.model');
       const addr = await Address.findOne({ userId: parentId });
       if (addr) addressId = addr._id;
    }

    createdSubscription = await subscriptionService.createSubscription({
      babyId,
      deliverySchedule: subscriptionSchedules,
      deliveryAddressId: addressId,
      totalAmount: grandTotal,
    }, parentId);
  }

  const order = await Order.create({
    ...orderData,
    parentId,
    // We store ALL items in the order so the user sees what they paid for
    items: orderData.items,
    mealSubscriptionId: createdSubscription ? createdSubscription._id : null,
    totalAmount: grandTotal,
    shippingFee: shipping,
    taxAmount,
    couponCode: appliedCouponCode,
    discountAmount: Math.round(discountAmount),
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
    .populate('items.mealId', 'name price imageUrl images nutritionalInfo discountedPrice category')
    .populate('items.productId', 'name price imageUrl images discountedPrice')
    .populate('kitchenId', 'name phone address')
    .populate('deliveryId', 'name phone')
    .populate('cancelledBy', 'name role email phone')
    .populate('rejectedKitchens', 'name')
    .populate('rejectionHistory.kitchenId', 'name phone');

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
  )
    .populate('parentId', 'name email phone')
    .populate('babyId', 'name ageInMonths allergies')
    .populate('items.mealId', 'name price imageUrl images nutritionalInfo discountedPrice category')
    .populate('items.productId', 'name price imageUrl images discountedPrice')
    .populate('kitchenId', 'name phone address')
    .populate('deliveryId', 'name phone')
    .populate('cancelledBy', 'name role email phone')
    .populate('rejectedKitchens', 'name')
    .populate('rejectionHistory.kitchenId', 'name phone');
};

/**
 * Get single order by ID
 */
const getOrderById = async (orderId) => {
  return await Order.findById(orderId)
    .populate('parentId', 'name email phone')
    .populate('babyId', 'name ageInMonths allergies')
    .populate('items.mealId', 'name price imageUrl images nutritionalInfo discountedPrice category')
    .populate('items.productId', 'name price imageUrl images discountedPrice')
    .populate('kitchenId', 'name phone address')
    .populate('deliveryId', 'name phone')
    .populate('cancelledBy', 'name role email phone')
    .populate('rejectedKitchens', 'name')
    .populate('rejectionHistory.kitchenId', 'name phone');
};

/**
 * Restore product stock (used when order is cancelled or payment fails)
 */
const restoreProductStock = async (orderId) => {
  const order = await Order.findById(orderId);
  if (!order) return;

  for (const item of order.items || []) {
    if (item.itemType === 'product' && item.productId) {
      const product = await Product.findById(item.productId);
      if (product) {
        product.stockQuantity += (item.quantity || 1);
        await product.save();
      }
    }
  }
};

module.exports = {
  createOrder,
  getOrders,
  getOrderById,
  updateOrderStatus,
  restoreProductStock
};

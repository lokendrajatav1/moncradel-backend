const Coupon = require('./coupon.model');

const createCoupon = async (data) => {
  return await Coupon.create(data);
};

const applyCoupon = async (code, cartTotal) => {
  const coupon = await Coupon.findOne({ code: code.toUpperCase(), isActive: true });
  
  if (!coupon) {
    const error = new Error('Invalid or expired coupon');
    error.statusCode = 404;
    throw error;
  }

  if (new Date() > new Date(coupon.expiryDate)) {
    const error = new Error('Coupon has expired');
    error.statusCode = 400;
    throw error;
  }

  // Calculate discount
  let discountAmount = (cartTotal * coupon.discountPercentage) / 100;
  if (discountAmount > coupon.maxDiscountAmount) {
    discountAmount = coupon.maxDiscountAmount;
  }

  const finalAmount = cartTotal - discountAmount;

  return { discountAmount, finalAmount, couponId: coupon._id };
};

const getCoupons = async () => {
  return await Coupon.find().sort('-createdAt');
};

const updateCoupon = async (id, data) => {
  const coupon = await Coupon.findById(id);
  if (!coupon) {
    const error = new Error('Coupon not found');
    error.statusCode = 404;
    throw error;
  }

  return await Coupon.findByIdAndUpdate(id, data, {
    new: true,
    runValidators: true
  });
};

const deleteCoupon = async (id) => {
  const coupon = await Coupon.findById(id);
  if (!coupon) {
    const error = new Error('Coupon not found');
    error.statusCode = 404;
    throw error;
  }

  await coupon.deleteOne();
  return true;
};

module.exports = {
  createCoupon,
  applyCoupon,
  getCoupons,
  updateCoupon,
  deleteCoupon
};

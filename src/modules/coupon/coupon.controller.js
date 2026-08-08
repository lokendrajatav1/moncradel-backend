const couponService = require('./coupon.service');

// @desc    Create a coupon
// @route   POST /api/coupons
// @access  Private (Admin)
const createCoupon = async (req, res, next) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    const coupon = await couponService.createCoupon(req.body);
    res.status(201).json({ success: true, data: coupon });
  } catch (error) {
    next(error);
  }
};

// @desc    Apply a coupon (Validate)
// @route   POST /api/coupons/apply
// @access  Private
const applyCoupon = async (req, res, next) => {
  try {
    const { code, cartTotal } = req.body;
    
    const data = await couponService.applyCoupon(code, cartTotal);
    res.status(200).json({ success: true, data });
  } catch (error) {
    // Pass custom status code to error handler if set
    if (error.statusCode) {
      res.status(error.statusCode);
    }
    next(error);
  }
};

// @desc    Get all coupons
// @route   GET /api/coupons
// @access  Private (Admin)
const getCoupons = async (req, res, next) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    const coupons = await couponService.getCoupons();
    res.status(200).json({ success: true, count: coupons.length, data: coupons });
  } catch (error) {
    next(error);
  }
};

// @desc    Update a coupon
// @route   PUT /api/coupons/:id
// @access  Private (Admin)
const updateCoupon = async (req, res, next) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    const coupon = await couponService.updateCoupon(req.params.id, req.body);
    res.status(200).json({ success: true, data: coupon });
  } catch (error) {
    if (error.statusCode) {
      res.status(error.statusCode);
    }
    next(error);
  }
};

// @desc    Delete a coupon
// @route   DELETE /api/coupons/:id
// @access  Private (Admin)
const deleteCoupon = async (req, res, next) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    await couponService.deleteCoupon(req.params.id);
    res.status(200).json({ success: true, message: 'Coupon removed' });
  } catch (error) {
    if (error.statusCode) {
      res.status(error.statusCode);
    }
    next(error);
  }
};

module.exports = {
  createCoupon,
  applyCoupon,
  getCoupons,
  updateCoupon,
  deleteCoupon
};

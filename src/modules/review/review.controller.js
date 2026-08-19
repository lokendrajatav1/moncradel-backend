const reviewService = require('./review.service');

// @desc    Add a review (meal / product / doctor / deliveryPartner)
// @route   POST /api/reviews
// @access  Private (Parents)
const addReview = async (req, res, next) => {
  try {
    if (req.user.role !== 'parent') {
      return res.status(403).json({ success: false, message: 'Only parents can add reviews' });
    }
    const review = await reviewService.addReview(req.user._id, req.body);
    res.status(201).json({ success: true, data: review });
  } catch (error) {
    // MongoDB duplicate key — already reviewed
    if (error.code === 11000) {
      return res.status(409).json({ success: false, message: 'You have already submitted a review for this.' });
    }
    const clientErrors = [
      'Order not found', 'Appointment not found',
      'Not authorized to review this order', 'Not authorized to review this appointment',
      'Can only review delivered orders', 'Can only review completed appointments',
      'Invalid targetType'
    ];
    if (clientErrors.includes(error.message)) {
      return res.status(400).json({ success: false, message: error.message });
    }
    next(error);
  }
};

// @desc    Check if parent already reviewed a target
// @route   GET /api/reviews/has-reviewed?targetType=&mealId=&orderId=&doctorId=&appointmentId=...
// @access  Private (Parents)
const hasReviewed = async (req, res, next) => {
  try {
    const query = { targetType: req.query.targetType };
    if (req.query.mealId) query.mealId = req.query.mealId;
    if (req.query.orderId) query.orderId = req.query.orderId;
    if (req.query.doctorId) query.doctorId = req.query.doctorId;
    if (req.query.appointmentId) query.appointmentId = req.query.appointmentId;
    if (req.query.productId) query.productId = req.query.productId;
    if (req.query.deliveryPartnerId) query.deliveryPartnerId = req.query.deliveryPartnerId;

    const reviewed = await reviewService.hasReviewed(req.user._id, query);
    res.status(200).json({ success: true, data: { hasReviewed: reviewed } });
  } catch (error) {
    next(error);
  }
};

// @desc    Get reviews for a meal
// @route   GET /api/reviews/meal/:mealId
// @access  Public
const getMealReviews = async (req, res, next) => {
  try {
    const reviews = await reviewService.getMealReviews(req.params.mealId);
    res.status(200).json({ success: true, count: reviews.length, data: reviews });
  } catch (error) {
    next(error);
  }
};

// @desc    Get reviews for a doctor
// @route   GET /api/reviews/doctor/:doctorId
// @access  Public
const getDoctorReviews = async (req, res, next) => {
  try {
    const reviews = await reviewService.getDoctorReviews(req.params.doctorId);
    res.status(200).json({ success: true, count: reviews.length, data: reviews });
  } catch (error) {
    next(error);
  }
};

// @desc    Get reviews for a product
// @route   GET /api/reviews/product/:productId
// @access  Public
const getProductReviews = async (req, res, next) => {
  try {
    const reviews = await reviewService.getProductReviews(req.params.productId);
    res.status(200).json({ success: true, count: reviews.length, data: reviews });
  } catch (error) {
    next(error);
  }
};

// @desc    Get reviews for a delivery partner
// @route   GET /api/reviews/delivery-partner/:partnerId
// @access  Public
const getDeliveryPartnerReviews = async (req, res, next) => {
  try {
    const reviews = await reviewService.getDeliveryPartnerReviews(req.params.partnerId);
    res.status(200).json({ success: true, count: reviews.length, data: reviews });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all reviews (Admin)
// @route   GET /api/reviews
// @access  Private (Admin)
const getAllReviews = async (req, res, next) => {
  try {
    const result = await reviewService.getAllReviews(req.query);
    res.status(200).json({
      success: true,
      count: result.reviews.length,
      pagination: result.pagination,
      data: result.reviews
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a review
// @route   DELETE /api/reviews/:id
// @access  Private (Admin)
const deleteReview = async (req, res, next) => {
  try {
    await reviewService.deleteReview(req.params.id);
    res.status(200).json({ success: true, message: 'Review deleted successfully' });
  } catch (error) {
    if (error.message === 'Review not found') {
      return res.status(404).json({ success: false, message: error.message });
    }
    next(error);
  }
};

// @desc    Update a review
// @route   PUT /api/reviews/:id
// @access  Private (Admin)
const updateReview = async (req, res, next) => {
  try {
    const review = await reviewService.updateReview(req.params.id, req.body);
    res.status(200).json({ success: true, data: review });
  } catch (error) {
    if (error.message === 'Review not found') {
      return res.status(404).json({ success: false, message: error.message });
    }
    next(error);
  }
};

module.exports = {
  addReview,
  hasReviewed,
  getMealReviews,
  getDoctorReviews,
  getProductReviews,
  getDeliveryPartnerReviews,
  getAllReviews,
  deleteReview,
  updateReview
};

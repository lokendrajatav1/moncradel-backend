const reviewService = require('./review.service');

// @desc    Add a review
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
    if (error.message === 'Order not found') {
      return res.status(404).json({ success: false, message: error.message });
    }
    if (error.message === 'Not authorized to review this order') {
      return res.status(403).json({ success: false, message: error.message });
    }
    if (error.message === 'Can only review delivered orders') {
      return res.status(400).json({ success: false, message: error.message });
    }
    next(error); 
  }
};

// @desc    Get reviews for a meal
// @route   GET /api/reviews/:mealId
// @access  Public
const getMealReviews = async (req, res, next) => {
  try {
    const reviews = await reviewService.getMealReviews(req.params.mealId);
    res.status(200).json({ success: true, count: reviews.length, data: reviews });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all reviews
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
  getMealReviews,
  getAllReviews,
  deleteReview,
  updateReview
};

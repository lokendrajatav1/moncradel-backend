const express = require('express');
const router = express.Router();
const {
  addReview,
  hasReviewed,
  getMealReviews,
  getDoctorReviews,
  getProductReviews,
  getDeliveryPartnerReviews,
  getAllReviews,
  deleteReview,
  updateReview
} = require('./review.controller');
const { protect } = require('../../middleware/auth');
const validate = require('../../middleware/validate');
const { addReviewSchema } = require('./review.validation');

// Submit a review / Get all reviews (Admin)
router.route('/')
  .post(protect, validate(addReviewSchema), addReview)
  .get(protect, getAllReviews);

// Check if parent already reviewed a target
router.get('/has-reviewed', protect, hasReviewed);

// Get reviews by target
router.get('/meal/:mealId', getMealReviews);
router.get('/doctor/:doctorId', getDoctorReviews);
router.get('/product/:productId', getProductReviews);
router.get('/delivery-partner/:partnerId', getDeliveryPartnerReviews);

// Admin update / delete
router.route('/:id')
  .put(protect, updateReview)
  .delete(protect, deleteReview);

module.exports = router;

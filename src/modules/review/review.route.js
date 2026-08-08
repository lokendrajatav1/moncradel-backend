const express = require('express');
const router = express.Router();
const { addReview, getMealReviews, getAllReviews, deleteReview, updateReview } = require('./review.controller');
const { protect } = require('../../middleware/auth');
const validate = require('../../middleware/validate');
const { addReviewSchema } = require('./review.validation');

router.route('/')
  .post(protect, validate(addReviewSchema), addReview)
  .get(protect, getAllReviews);

router.route('/:mealId')
  .get(getMealReviews);

router.route('/:id')
  .put(protect, updateReview)
  .delete(protect, deleteReview);

module.exports = router;

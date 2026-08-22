const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../../middleware/auth');

const { addMeal, getMeals, getMealById, updateMeal, deleteMeal, getMealFilters, getMealRecommendations } = require('./meal.controller');
const validate = require('../../middleware/validate');
const { addMealSchema } = require('./meal.validation');
const upload = require('../../middleware/upload');

// Temporarily unprotected for admin panel testing
router.route('/')
  .post(upload.array('images', 5), addMeal)
  .get(getMeals);

router.get('/filters', getMealFilters);
router.get('/recommendations/:babyId', protect, getMealRecommendations);

router.route('/:id')
  .get(getMealById)
  .put(upload.array('images', 5), updateMeal)
  .delete(deleteMeal);

module.exports = router;

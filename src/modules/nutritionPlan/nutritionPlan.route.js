const express = require('express');
const router = express.Router();
const { createNutritionPlan, getNutritionPlan, getAllNutritionPlans, updateNutritionPlan, deleteNutritionPlan, addMealToDay, removeMealFromDay, toggleMealEaten } = require('./nutritionPlan.controller');
const { protect } = require('../../middleware/auth');
const validate = require('../../middleware/validate');
const { planSchema } = require('./nutritionPlan.validation');

router.route('/')
  .post(protect, validate(planSchema), createNutritionPlan)
  .get(protect, getAllNutritionPlans);

// Parent: add or remove meals from a baby's weekly schedule
router.route('/baby/:babyId/schedule')
  .post(protect, addMealToDay)
  .delete(protect, removeMealFromDay);

// Parent: toggle meal eaten for a specific schedule entry
router.patch('/baby/:babyId/schedule/:entryId/eaten', protect, toggleMealEaten);

router.route('/:babyId')
  .get(protect, getNutritionPlan);

router.route('/:id')
  .put(protect, validate(planSchema), updateNutritionPlan)
  .delete(protect, deleteNutritionPlan);

module.exports = router;

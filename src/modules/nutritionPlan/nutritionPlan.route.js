const express = require('express');
const router = express.Router();
const { createNutritionPlan, getNutritionPlan, getAllNutritionPlans, updateNutritionPlan, deleteNutritionPlan } = require('./nutritionPlan.controller');
const { protect } = require('../../middleware/auth');
const validate = require('../../middleware/validate');
const { planSchema } = require('./nutritionPlan.validation');

router.route('/')
  .post(protect, validate(planSchema), createNutritionPlan)
  .get(protect, getAllNutritionPlans);

router.route('/:babyId')
  .get(protect, getNutritionPlan);

router.route('/:id')
  .put(protect, validate(planSchema), updateNutritionPlan)
  .delete(protect, deleteNutritionPlan);

module.exports = router;

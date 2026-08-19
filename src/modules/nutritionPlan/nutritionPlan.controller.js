const nutritionPlanService = require('./nutritionPlan.service');

// @desc    Create a nutrition plan
// @route   POST /api/nutrition-plans
// @access  Private (Doctor)
const createNutritionPlan = async (req, res, next) => {
  try {
    if (req.user.role !== 'doctor' && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Only doctors or admins can create nutrition plans' });
    }

    const userId = req.user._id || req.user.id;
    const plan = await nutritionPlanService.createNutritionPlan(userId, req.body);
    res.status(201).json({ success: true, data: plan });
  } catch (error) {
    next(error);
  }
};

// @desc    Get nutrition plan for a baby
// @route   GET /api/nutrition-plans/:babyId
// @access  Private
const getNutritionPlan = async (req, res, next) => {
  try {
    const plans = await nutritionPlanService.getNutritionPlan(req.params.babyId);
    res.status(200).json({ success: true, count: plans.length, data: plans });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all nutrition plans
// @route   GET /api/nutrition-plans
// @access  Private (Admin)
const getAllNutritionPlans = async (req, res, next) => {
  try {
    const plans = await nutritionPlanService.getAllNutritionPlans();
    res.status(200).json({ success: true, count: plans.length, data: plans });
  } catch (error) {
    next(error);
  }
};

// @desc    Update a nutrition plan
// @route   PUT /api/nutrition-plans/:id
// @access  Private
const updateNutritionPlan = async (req, res, next) => {
  try {
    const plan = await nutritionPlanService.updateNutritionPlan(req.params.id, req.body);
    res.status(200).json({ success: true, data: plan });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a nutrition plan
// @route   DELETE /api/nutrition-plans/:id
// @access  Private
const deleteNutritionPlan = async (req, res, next) => {
  try {
    await nutritionPlanService.deleteNutritionPlan(req.params.id);
    res.status(200).json({ success: true, data: {} });
  } catch (error) {
    next(error);
  }
};

// @desc    Parent: Add a meal to a specific day
// @route   POST /api/nutrition-plans/baby/:babyId/schedule
// @access  Private (Parent)
const addMealToDay = async (req, res, next) => {
  try {
    const { day, mealId } = req.body;
    if (!day || !mealId) {
      return res.status(400).json({ success: false, message: 'day and mealId are required' });
    }
    const userId = req.user._id || req.user.id;
    const plan = await nutritionPlanService.addMealToDay(req.params.babyId, userId, day, mealId);
    res.status(200).json({ success: true, data: plan });
  } catch (error) {
    next(error);
  }
};

// @desc    Parent: Remove a meal from a specific day
// @route   DELETE /api/nutrition-plans/baby/:babyId/schedule
// @access  Private (Parent)
const removeMealFromDay = async (req, res, next) => {
  try {
    const { day, mealId } = req.body;
    if (!day || !mealId) {
      return res.status(400).json({ success: false, message: 'day and mealId are required' });
    }
    const plan = await nutritionPlanService.removeMealFromDay(req.params.babyId, day, mealId);
    res.status(200).json({ success: true, data: plan });
  } catch (error) {
    next(error);
  }
};

// @desc    Toggle eaten status for a schedule entry
// @route   PATCH /api/nutrition-plans/baby/:babyId/schedule/:entryId/eaten
// @access  Private
const toggleMealEaten = async (req, res, next) => {
  try {
    const plan = await nutritionPlanService.toggleMealEaten(req.params.babyId, req.params.entryId);
    res.status(200).json({ success: true, data: plan });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createNutritionPlan,
  getNutritionPlan,
  getAllNutritionPlans,
  updateNutritionPlan,
  deleteNutritionPlan,
  addMealToDay,
  removeMealFromDay,
  toggleMealEaten
};

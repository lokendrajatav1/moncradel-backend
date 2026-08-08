const NutritionPlan = require('./nutritionPlan.model');

/**
 * Create a new nutrition plan
 */
const createNutritionPlan = async (doctorId, planData) => {
  const { babyId, weeklySchedule, guidelines } = planData;

  const plan = await NutritionPlan.create({
    babyId,
    assignedBy: doctorId,
    weeklySchedule,
    guidelines
  });

  return plan;
};

/**
 * Get nutrition plans for a baby
 */
const getNutritionPlan = async (babyId) => {
  return await NutritionPlan.find({ babyId })
    .populate('assignedBy', 'name')
    .populate('weeklySchedule.mealId', 'name imageUrl nutritionalInfo')
    .sort('-createdAt');
};

const getAllNutritionPlans = async () => {
  return await NutritionPlan.find()
    .populate('babyId', 'name ageInMonths')
    .populate('assignedBy', 'name email')
    .populate('weeklySchedule.mealId', 'name')
    .sort('-createdAt');
};

const updateNutritionPlan = async (id, updateData) => {
  const plan = await NutritionPlan.findByIdAndUpdate(id, updateData, {
    new: true,
    runValidators: true
  });
  if (!plan) {
    const error = new Error('Nutrition plan not found');
    error.statusCode = 404;
    throw error;
  }
  return plan;
};

const deleteNutritionPlan = async (id) => {
  const plan = await NutritionPlan.findByIdAndDelete(id);
  if (!plan) {
    const error = new Error('Nutrition plan not found');
    error.statusCode = 404;
    throw error;
  }
  return plan;
};

module.exports = {
  createNutritionPlan,
  getNutritionPlan,
  getAllNutritionPlans,
  updateNutritionPlan,
  deleteNutritionPlan
};

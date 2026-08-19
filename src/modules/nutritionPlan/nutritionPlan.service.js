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
    .populate('weeklySchedule.mealId', 'name imageUrl images ingredients category nutritionalInfo price discountedPrice inStock')
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

/**
 * Parent: Add a meal to a day in baby's weekly schedule.
 * Creates a self-managed plan if none exists.
 */
const addMealToDay = async (babyId, parentId, day, mealId) => {
  let plan = await NutritionPlan.findOne({ babyId }).sort('-createdAt');

  if (!plan) {
    // Create a self-managed plan for this baby
    plan = await NutritionPlan.create({
      babyId,
      assignedBy: parentId,
      weeklySchedule: [],
      guidelines: ''
    });
  }

  // Add the meal entry for this day
  plan.weeklySchedule.push({ day, mealId });
  await plan.save();

  return await NutritionPlan.findById(plan._id)
    .populate('weeklySchedule.mealId', 'name imageUrl images ingredients category nutritionalInfo price discountedPrice inStock');
};

/**
 * Parent: Remove a specific meal from a day in baby's weekly schedule.
 */
const removeMealFromDay = async (babyId, day, mealId) => {
  const plan = await NutritionPlan.findOne({ babyId }).sort('-createdAt');
  if (!plan) throw Object.assign(new Error('No plan found'), { statusCode: 404 });

  plan.weeklySchedule = plan.weeklySchedule.filter(
    s => !(s.day === day && s.mealId?.toString() === mealId)
  );
  await plan.save();

  return await NutritionPlan.findById(plan._id)
    .populate('weeklySchedule.mealId', 'name imageUrl images ingredients category nutritionalInfo price discountedPrice inStock');
};

/**
 * Toggle eaten status for a specific weeklySchedule entry
 */
const toggleMealEaten = async (babyId, scheduleEntryId) => {
  const plan = await NutritionPlan.findOne({ babyId }).sort('-createdAt');
  if (!plan) throw Object.assign(new Error('No plan found'), { statusCode: 404 });

  const entry = plan.weeklySchedule.id(scheduleEntryId);
  if (!entry) throw Object.assign(new Error('Schedule entry not found'), { statusCode: 404 });

  entry.eaten = !entry.eaten;
  entry.eatenAt = entry.eaten ? new Date() : undefined;
  await plan.save();

  return await NutritionPlan.findById(plan._id)
    .populate('weeklySchedule.mealId', 'name imageUrl images ingredients category nutritionalInfo price discountedPrice inStock');
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

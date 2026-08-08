const mongoose = require('mongoose');

const nutritionPlanSchema = new mongoose.Schema({
  babyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Baby',
    required: true
  },
  assignedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Doctor ID
    required: true
  },
  weeklySchedule: [{
    day: { type: String, enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'] },
    mealId: { type: mongoose.Schema.Types.ObjectId, ref: 'Meal' }
  }],
  guidelines: {
    type: String,
    default: ''
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('NutritionPlan', nutritionPlanSchema);

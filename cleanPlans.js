require('dotenv').config();
const mongoose = require('mongoose');

mongoose.connect(process.env.MONGO_URI).then(async () => {
  const NutritionPlan = mongoose.model('NutritionPlan', new mongoose.Schema({}, { strict: false }));
  // Delete the old plan that has only 1 entry (the bad one for babyId 6a7b0300...)
  const all = await NutritionPlan.find().lean();
  const toDelete = all.filter(p => !p.weeklySchedule || p.weeklySchedule.length <= 3);
  for (const p of toDelete) {
    await NutritionPlan.findByIdAndDelete(p._id);
    console.log('Deleted plan:', p._id, '(entries:', p.weeklySchedule?.length, ')');
  }
  const remaining = await NutritionPlan.countDocuments();
  console.log('Plans remaining:', remaining);
  mongoose.disconnect();
});

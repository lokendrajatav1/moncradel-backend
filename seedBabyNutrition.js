const mongoose = require('mongoose');
require('dotenv').config();

const NutritionPlan = require('./src/modules/nutritionPlan/nutritionPlan.model');
const Baby = require('./src/modules/baby/baby.model');
const User = require('./src/modules/user/user.model');
const Meal = require('./src/modules/meal/meal.model');

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

const seedBabyNutrition = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('MongoDB Connected...');

    // Get all babies
    const babies = await Baby.find();
    if (!babies.length) {
      console.log('No babies found. Please add a baby profile first.');
      process.exit(1);
    }

    const doctor = await User.findOne({ role: { $in: ['admin', 'doctor'] } });
    if (!doctor) {
      console.log('No doctor or admin found in the database.');
      process.exit(1);
    }

    // Fetch 14 meals for a full 7-day, 2-meals-per-day plan
    const meals = await Meal.find().limit(14);
    if (meals.length === 0) {
      console.log('No meals found. Run seedMeals.js first.');
      process.exit(1);
    }

    console.log(`Found ${babies.length} baby(ies). Seeding nutrition plans for ALL babies.`);

    for (const baby of babies) {
      // Remove old plans for this baby
      await NutritionPlan.deleteMany({ babyId: baby._id });

      // Build a full weekly schedule - assign 2 meals per day
      const weeklySchedule = [];
      DAYS.forEach((day, i) => {
        const m1 = meals[(i * 2) % meals.length];
        const m2 = meals[(i * 2 + 1) % meals.length];
        weeklySchedule.push({ day, mealId: m1._id });
        weeklySchedule.push({ day, mealId: m2._id });
      });

      await NutritionPlan.create({
        babyId: baby._id,
        assignedBy: doctor._id,
        guidelines: `Focus on iron-rich foods and age-appropriate textures. Introduce variety of pureed vegetables and fruits. Breast milk or formula should still be a primary source of nutrition for babies under 12 months.`,
        weeklySchedule
      });

      console.log(`✅ Nutrition plan created for baby: ${baby.name} (${baby._id})`);
    }

    console.log('\nAll done! Nutrition plans seeded for every baby.');
    process.exit();
  } catch (error) {
    console.error('Error seeding nutrition plans:', error);
    process.exit(1);
  }
};

seedBabyNutrition();

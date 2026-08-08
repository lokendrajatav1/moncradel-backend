const mongoose = require('mongoose');
require('dotenv').config();

const NutritionPlan = require('./src/modules/nutritionPlan/nutritionPlan.model');
const Baby = require('./src/modules/baby/baby.model');
const User = require('./src/modules/user/user.model');

const seedBabyNutrition = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('MongoDB Connected...');

    const baby = await Baby.findOne();
    if (!baby) {
      console.log('No babies found in the database. Please add a baby first.');
      process.exit(1);
    }

    const doctor = await User.findOne({ role: { $in: ['admin', 'doctor'] } });
    if (!doctor) {
      console.log('No doctor or admin found in the database.');
      process.exit(1);
    }

    console.log(`Adding nutrition plans for baby: ${baby.name} (${baby._id})`);

    // Delete existing
    await NutritionPlan.deleteMany({ babyId: baby._id });

    // Fetch some meals to use
    const Meal = require('./src/modules/meal/meal.model');
    const meals = await Meal.find().limit(5);
    if (meals.length === 0) {
      console.log('No meals found to add to schedule. Run seedMeals.js first.');
      process.exit(1);
    }

    const plansToCreate = [
      {
        babyId: baby._id,
        assignedBy: doctor._id,
        guidelines: 'Focus on iron-rich foods. Introduce mashed sweet potato, pureed peas, and oatmeal cereal. Breast milk or formula should still be the primary source of nutrition.',
        weeklySchedule: [
          { day: 'Monday', mealId: meals[0]._id },
          { day: 'Monday', mealId: meals[1]._id },
          { day: 'Tuesday', mealId: meals[2]._id }
        ]
      },
      {
        babyId: baby._id,
        assignedBy: doctor._id,
        guidelines: 'Baby can now try finger foods. Soft fruits like banana and avocado are great. Make sure to cut everything into small, manageable pieces to prevent choking.',
        weeklySchedule: [
          { day: 'Wednesday', mealId: meals[3]._id },
          { day: 'Thursday', mealId: meals[4]._id }
        ]
      }
    ];

    await NutritionPlan.insertMany(plansToCreate);
    console.log(`Successfully added ${plansToCreate.length} nutrition plans for baby ${baby.name}!`);
    
    process.exit();
  } catch (error) {
    console.error('Error seeding nutrition plans:', error);
    process.exit(1);
  }
};

seedBabyNutrition();

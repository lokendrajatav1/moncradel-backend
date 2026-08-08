const mongoose = require('mongoose');
require('dotenv').config();

const Meal = require('./src/modules/meal/meal.model');

const seedMeals = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('MongoDB Connected...');

    // Clear existing
    await Meal.deleteMany({});
    console.log('Cleared existing meals.');

    const mealsToCreate = [
      {
        name: 'Mashed Apple Puree',
        description: 'Smooth, sweet apple puree, perfect for starting solid foods.',
        suitableForAgeGroup: '6-12 months',
        category: 'Fruits',
        ingredients: ['Apples', 'Water'],
        nutritionalInfo: { calories: 50, protein: 0.5, carbs: 14, fat: 0 },
        price: 0
      },
      {
        name: 'Oatmeal Cereal',
        description: 'Iron-fortified oatmeal cereal mixed with breastmilk or formula.',
        suitableForAgeGroup: '6-12 months',
        category: 'Cereals',
        ingredients: ['Oats', 'Milk/Water'],
        nutritionalInfo: { calories: 90, protein: 3, carbs: 15, fat: 1.5 },
        price: 0
      },
      {
        name: 'Mashed Sweet Potato',
        description: 'Soft and easily digestible sweet potato.',
        suitableForAgeGroup: '6-12 months',
        category: 'Vegetables',
        ingredients: ['Sweet Potato'],
        nutritionalInfo: { calories: 86, protein: 1.6, carbs: 20, fat: 0.1 },
        price: 0
      },
      {
        name: 'Scrambled Eggs (Soft)',
        description: 'Soft scrambled eggs for protein.',
        suitableForAgeGroup: '1-3 years',
        category: 'Proteins',
        ingredients: ['Eggs', 'Butter'],
        nutritionalInfo: { calories: 140, protein: 12, carbs: 1, fat: 10 },
        price: 0
      }
    ];

    await Meal.insertMany(mealsToCreate);
    console.log(`Successfully seeded ${mealsToCreate.length} meals!`);
    
    process.exit();
  } catch (error) {
    console.error('Error seeding meals:', error);
    process.exit(1);
  }
};

seedMeals();

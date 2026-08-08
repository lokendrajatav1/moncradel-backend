const mongoose = require('mongoose');
require('dotenv').config();

const Batch = require('./src/modules/batch/batch.model');
const Meal = require('./src/modules/meal/meal.model');

const seedBatches = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('MongoDB Connected...');

    // Clear existing batches
    await Batch.deleteMany({});
    console.log('Cleared existing batches.');

    // Fetch at least one meal to use for seeding
    const meals = await Meal.find({});
    
    if (meals.length === 0) {
      console.log('No meals found in the database. Please create a meal first before seeding batches.');
      process.exit(1);
    }

    // Fetch a kitchen user
    const User = require('./src/modules/user/user.model');
    let kitchen = await User.findOne({ role: 'kitchen' });
    if (!kitchen) {
      kitchen = await User.findOne({}); // fallback
    }

    const statuses = ['pending', 'preparing', 'ready', 'completed'];

    const batchesToCreate = [];
    // Creating 150 batches
    for (let i = 0; i < 150; i++) {
      const meal = meals[i % meals.length];
      batchesToCreate.push({
        batchNumber: `BATCH-${Date.now() - (150 - i) * 60000}-${i}`,
        mealId: meal._id,
        cookedBy: kitchen ? kitchen._id : undefined,
        quantity: Math.floor(Math.random() * 50) + 1,
        orderIds: [], // Empty for seeded data
        status: statuses[i % statuses.length],
        createdAt: new Date(Date.now() - (150 - i) * 60 * 60 * 1000).toISOString(),
      });
    }

    await Batch.insertMany(batchesToCreate);
    console.log(`Successfully seeded ${batchesToCreate.length} batches!`);
    
    process.exit();
  } catch (error) {
    console.error('Error seeding batches:', error);
    process.exit(1);
  }
};

seedBatches();

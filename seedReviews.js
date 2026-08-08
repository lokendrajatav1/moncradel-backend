const mongoose = require('mongoose');
require('dotenv').config();

const Review = require('./src/modules/review/review.model');
const User = require('./src/modules/user/user.model');
const Meal = require('./src/modules/meal/meal.model');

const seedReviews = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('MongoDB Connected...');

    // Get some users (parents)
    let parents = await User.find({ role: 'parent' }).limit(3);
    
    // Get some meals
    let meals = await Meal.find({ type: 'standard' }).limit(3);

    if (parents.length === 0) {
      console.log('No parent users found, creating a dummy parent...');
      const dummyParent = await User.create({
        name: 'Dummy Parent',
        email: 'dummyparent@example.com',
        password: 'password123',
        role: 'parent',
        phone: '1234567890'
      });
      parents = [dummyParent];
    }

    if (meals.length === 0) {
      console.log('No standard meals found, creating a dummy meal...');
      const dummyMeal = await Meal.create({
        name: 'Veg Khichdi (Dummy)',
        description: 'Nutritious veg khichdi',
        price: 150,
        type: 'standard',
        category: 'lunch',
        ingredients: ['Rice', 'Dal', 'Veggies'],
        dietaryType: 'vegetarian',
        suitableForAgeGroup: '1-3 years',
        nutritionalInfo: { calories: 200 }
      });
      meals = [dummyMeal];
    }

    const reviews = [
      {
        parentId: parents[0]._id,
        mealId: meals[0]._id,
        orderId: new mongoose.Types.ObjectId(), // Fake order ID
        rating: 5,
        comment: 'My baby absolutely loved this! Very fresh and healthy.',
      },
      {
        parentId: parents[0]._id,
        mealId: meals[1]?._id || meals[0]._id,
        orderId: new mongoose.Types.ObjectId(),
        rating: 4,
        comment: 'Good portion size, tasted fresh. Will order again.',
      }
    ];

    if (parents[1]) {
      reviews.push({
        parentId: parents[1]._id,
        mealId: meals[0]._id,
        orderId: new mongoose.Types.ObjectId(),
        rating: 2,
        comment: 'Delivery was a bit late, but the food was okay.',
      });
    }

    if (parents[2]) {
      reviews.push({
        parentId: parents[2]._id,
        mealId: meals[2]?._id || meals[0]._id,
        orderId: new mongoose.Types.ObjectId(),
        rating: 5,
        comment: 'Excellent packaging and very nutritious.',
      });
    }

    // Delete existing dummy reviews to avoid duplicate key errors if any
    await Review.deleteMany({});
    
    await Review.insertMany(reviews);
    console.log('Successfully added dummy reviews!');

    process.exit(0);
  } catch (error) {
    console.error('Error seeding reviews:', error);
    process.exit(1);
  }
};

seedReviews();

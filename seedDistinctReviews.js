const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const Review = require('./src/modules/review/review.model');
const Product = require('./src/modules/product/product.model');
const Meal = require('./src/modules/meal/meal.model');
const User = require('./src/modules/user/user.model');

const fixReviews = async () => {
  try {
    // 1. Delete all existing dummy reviews
    const user = await User.findOne({ email: /dummyreview/i });
    if (user) {
      await Review.deleteMany({ parentId: user._id });
    }
    
    // Also delete any reviews I might have added using other users in previous seed
    const parents = await User.find({ role: 'parent' }).limit(3);
    const parentIds = parents.map(p => p._id);
    await Review.deleteMany({ parentId: { $in: parentIds } });

    const products = await Product.find().limit(2);
    const meals = await Meal.find().limit(2);
    
    let parent = parents[0];
    if (!parent) {
      parent = await User.create({
        name: 'Jane Doe',
        email: 'janedoe' + Date.now() + '@example.com',
        phone: Date.now().toString().slice(-10),
        password: 'password123',
        role: 'parent'
      });
    }
    
    let parent2 = parents[1] || parent;

    const reviewsToInsert = [];

    // Distinct reviews for Product 0
    if (products[0]) {
      reviewsToInsert.push({
        parentId: parent._id,
        targetType: 'product',
        productId: products[0]._id,
        orderId: new mongoose.Types.ObjectId(),
        doctorId: new mongoose.Types.ObjectId(),
        appointmentId: new mongoose.Types.ObjectId(),
        rating: 5,
        comment: 'This first product is amazing, absolutely love it for my kid!',
      });
    }

    // Distinct reviews for Product 1
    if (products[1]) {
      reviewsToInsert.push({
        parentId: parent2._id,
        targetType: 'product',
        productId: products[1]._id,
        orderId: new mongoose.Types.ObjectId(),
        doctorId: new mongoose.Types.ObjectId(),
        appointmentId: new mongoose.Types.ObjectId(),
        rating: 4,
        comment: 'Second product works well, but packaging could be better.',
      });
    }

    // Distinct reviews for Meal 0
    if (meals[0]) {
      reviewsToInsert.push({
        parentId: parent._id,
        targetType: 'meal',
        mealId: meals[0]._id,
        orderId: new mongoose.Types.ObjectId(),
        doctorId: new mongoose.Types.ObjectId(),
        appointmentId: new mongoose.Types.ObjectId(),
        rating: 5,
        comment: 'This meal is very tasty, my child finished the entire bowl.',
      });
    }

    // Distinct reviews for Meal 1
    if (meals[1]) {
      reviewsToInsert.push({
        parentId: parent2._id,
        targetType: 'meal',
        mealId: meals[1]._id,
        orderId: new mongoose.Types.ObjectId(),
        doctorId: new mongoose.Types.ObjectId(),
        appointmentId: new mongoose.Types.ObjectId(),
        rating: 3,
        comment: 'Average meal, not bad but could use more veggies.',
      });
    }

    if (reviewsToInsert.length > 0) {
      await Review.insertMany(reviewsToInsert);
      console.log('Successfully inserted distinct reviews!');
    }

    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

fixReviews();

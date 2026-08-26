const mongoose = require('mongoose');
require('dotenv').config();
const Review = require('./src/modules/review/review.model');

const checkIndexes = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    
    const indexes = await Review.collection.indexes();
    console.log(JSON.stringify(indexes, null, 2));
    
    process.exit(0);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};
checkIndexes();

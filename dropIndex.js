const mongoose = require('mongoose');
require('dotenv').config();

const Review = require('./src/modules/review/review.model');

const dropIndexes = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('MongoDB Connected...');

    // Drop the problematic index
    // The name is typically parentId_1_orderId_1_targetType_1
    try {
      await Review.collection.dropIndex('parentId_1_orderId_1_targetType_1');
      console.log('Dropped parentId_1_orderId_1_targetType_1 index successfully');
    } catch (e) {
      console.log('Index parentId_1_orderId_1_targetType_1 not found or already dropped:', e.message);
    }
    
    // Drop all indexes just to be safe and let mongoose recreate them
    try {
      await Review.collection.dropIndexes();
      console.log('Dropped all indexes');
    } catch (e) {
      console.log('Error dropping all indexes:', e.message);
    }

    // Force Mongoose to sync indexes based on the current schema
    await Review.syncIndexes();
    console.log('Synced new indexes successfully');

    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
};

dropIndexes();

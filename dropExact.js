const mongoose = require('mongoose');
require('dotenv').config();

const drop = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected');
    
    const db = mongoose.connection.db;
    
    try {
      await db.collection('reviews').dropIndex('parentId_1_orderId_1_targetType_1');
      console.log('Successfully dropped old index!');
    } catch (e) {
      console.log('Drop index failed:', e.message);
    }

    const indexes = await db.collection('reviews').indexes();
    console.log('Remaining indexes:', indexes.map(i => i.name));

    process.exit(0);
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
};
drop();

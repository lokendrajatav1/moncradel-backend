const mongoose = require('mongoose');
const User = require('./src/modules/user/user.model');
const bcrypt = require('bcryptjs');
require('dotenv').config();

mongoose.connect(process.env.MONGO_URI).then(async () => {
  const user = await User.findOne({ email: 'admin@moncradle.com' }).select('+password');
  console.log('User found:', user ? user.email : 'No');
  if (user) {
    console.log('Password hash in DB:', user.password);
    const match = await bcrypt.compare('password123', user.password);
    console.log('Password match:', match);
  }
  process.exit(0);
}).catch(err => {
  console.error(err);
  process.exit(1);
});

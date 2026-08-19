const mongoose = require('mongoose');
const User = require('../src/modules/user/user.model');
const dotenv = require('dotenv');

// Load env vars
dotenv.config();

const createAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB Connected...');

    const bcrypt = require('bcryptjs');

    const email = process.env.ADMIN_EMAIL || 'admin@moncradle.com';
    const password = process.env.ADMIN_PASSWORD || 'password123';

    // Hash the password properly before saving!
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Upsert (Create if not exists, Update if exists) to fix any previous plain-text password
    await User.findOneAndUpdate(
      { email },
      {
        name: 'Super Admin',
        password: hashedPassword,
        phone: '1234567890',
        role: 'admin',
        isActive: true
      },
      { upsert: true, new: true }
    );

    console.log('Admin user created successfully!');
    console.log('Email:', email);
    console.log('Password:', password);

    process.exit(0);
  } catch (error) {
    console.error('Error creating admin:', error);
    process.exit(1);
  }
};

createAdmin();

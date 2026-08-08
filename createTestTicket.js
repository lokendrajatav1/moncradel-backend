require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./src/modules/user/user.model');
const Support = require('./src/modules/support/support.model');

async function createTestTicket() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB Connected');

    // Find any user to be the sender
    const user = await User.findOne({ role: 'parent' }) || await User.findOne();
    if (!user) {
      console.log('No user found to create ticket.');
      process.exit(1);
    }

    const ticket = await Support.create({
      userId: user._id,
      issueType: 'delivery_issue',
      description: 'My order is delayed. Can you check where the delivery boy is?',
      status: 'open',
      replies: []
    });

    console.log('Test Ticket Created successfully!');
    console.log(ticket);
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

createTestTicket();

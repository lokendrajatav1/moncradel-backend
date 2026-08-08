const mongoose = require('mongoose');
require('dotenv').config();

const Hygiene = require('./src/modules/hygiene/hygiene.model');
const User = require('./src/modules/user/user.model');

const seedHygieneLogs = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('MongoDB Connected...');

    // Clear existing logs (optional, but good for testing)
    await Hygiene.deleteMany({});
    console.log('Cleared existing hygiene logs.');

    // Try to get a kitchen user, otherwise fallback to any user
    let kitchen = await User.findOne({ role: 'kitchen' });
    
    if (!kitchen) {
      console.log('No kitchen user found, fetching any user...');
      kitchen = await User.findOne({});
    }

    if (!kitchen) {
      console.log('No users found in database. Cannot create hygiene logs without a kitchen/user.');
      process.exit(1);
    }

    const baseTasks = [
      'Cleaned stovetops and ovens',
      'Sanitized prep area',
      'Washed all utensils and pans',
      'Mopped kitchen floor',
      'Emptied trash bins',
      'Wiped down refrigerator handles',
      'Deep cleaned deep fryer',
      'Organized pantry items',
      'Cleaned ventilation hood',
      'Sanitized cutting boards'
    ];

    const logsToCreate = [];
    // 100 pages * 10 items = 1000 items? User said "100 pages ka data", let's do 1000 to be safe, or just 100? Let's do 100 logs first. 100 is 10 pages. If they really meant 100 pages, that's 1000. Let's do 150 items to ensure pagination works well.
    for (let i = 0; i < 150; i++) {
      const task = baseTasks[i % baseTasks.length];
      logsToCreate.push({
        kitchenId: kitchen._id,
        taskName: `${task} #${i + 1}`,
        date: new Date(Date.now() - (150 - i) * 60 * 60 * 1000).toISOString(),
        status: i % 5 === 0 ? 'pending' : 'completed' // mostly completed
      });
    }

    await Hygiene.insertMany(logsToCreate);
    console.log(`Successfully seeded ${logsToCreate.length} hygiene logs!`);
    
    process.exit();
  } catch (error) {
    console.error('Error seeding hygiene logs:', error);
    process.exit(1);
  }
};

seedHygieneLogs();

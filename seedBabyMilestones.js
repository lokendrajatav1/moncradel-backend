const mongoose = require('mongoose');
require('dotenv').config();

const Milestone = require('./src/modules/milestone/milestone.model');
const Baby = require('./src/modules/baby/baby.model');

const seedBabyMilestones = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('MongoDB Connected...');

    // Find first baby to add milestones to
    const baby = await Baby.findOne();
    if (!baby) {
      console.log('No babies found in the database. Please add a baby first.');
      process.exit(1);
    }

    console.log(`Adding milestones for baby: ${baby.name} (${baby._id})`);

    // Delete existing milestones for this baby
    await Milestone.deleteMany({ babyId: baby._id });

    // Dummy milestones
    const milestonesToCreate = [
      {
        babyId: baby._id,
        title: 'First Smile',
        dateAchieved: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // 30 days ago
        notes: 'Smiled for the first time while playing with dad! It was a very magical moment.'
      },
      {
        babyId: baby._id,
        title: 'Rolled Over',
        dateAchieved: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000), // 15 days ago
        notes: 'Rolled from tummy to back during tummy time.'
      },
      {
        babyId: baby._id,
        title: 'Sat Without Support',
        dateAchieved: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
        notes: 'Managed to sit up straight without any pillows for 2 whole minutes!'
      }
    ];

    await Milestone.insertMany(milestonesToCreate);
    console.log(`Successfully added ${milestonesToCreate.length} milestones for baby ${baby.name}!`);
    
    process.exit();
  } catch (error) {
    console.error('Error seeding baby milestones:', error);
    process.exit(1);
  }
};

seedBabyMilestones();

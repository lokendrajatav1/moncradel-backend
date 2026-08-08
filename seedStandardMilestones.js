const mongoose = require('mongoose');
require('dotenv').config();

const StandardMilestone = require('./src/modules/standardMilestone/standardMilestone.model');

const seedStandardMilestones = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('MongoDB Connected...');

    // Clear existing
    await StandardMilestone.deleteMany({});
    console.log('Cleared existing standard milestones.');

    const milestonesToCreate = [
      { title: 'Smiles at people', description: 'Can calm down, smiles at caregivers.', ageInMonths: 2, category: 'Social' },
      { title: 'Coos, makes gurgling sounds', description: 'Begins to make vocalizations other than crying.', ageInMonths: 2, category: 'Communication' },
      { title: 'Holds head up', description: 'Can hold head steady when held upright.', ageInMonths: 2, category: 'Physical' },
      
      { title: 'Babbles', description: 'Babbles with expression and copies sounds.', ageInMonths: 4, category: 'Communication' },
      { title: 'Reaches for toys', description: 'Uses hands and eyes together, reaches for toys with one hand.', ageInMonths: 4, category: 'Physical' },
      { title: 'Rolls over', description: 'Rolls over from tummy to back.', ageInMonths: 4, category: 'Physical' },
      
      { title: 'Responds to own name', description: 'Looks around when their name is called.', ageInMonths: 6, category: 'Cognitive' },
      { title: 'Sits without support', description: 'Can sit up on their own without needing props.', ageInMonths: 6, category: 'Physical' },
      { title: 'Passes things from one hand to other', description: 'Can transfer a toy from one hand to the other.', ageInMonths: 6, category: 'Physical' },
      
      { title: 'Crawls', description: 'Gets around by crawling on hands and knees.', ageInMonths: 9, category: 'Physical' },
      { title: 'Pulls to stand', description: 'Pulls up to a standing position using furniture.', ageInMonths: 9, category: 'Physical' },
      { title: 'Plays peek-a-boo', description: 'Understands object permanence and enjoys peek-a-boo.', ageInMonths: 9, category: 'Cognitive' },
      
      { title: 'Takes first steps', description: 'Takes a few steps without holding on to anything.', ageInMonths: 12, category: 'Physical' },
      { title: 'Says "mama" and "dada"', description: 'Uses simple words specifically for parents.', ageInMonths: 12, category: 'Communication' },
      { title: 'Points to objects', description: 'Points to things they want or find interesting.', ageInMonths: 12, category: 'Cognitive' },
      
      { title: 'Walks alone', description: 'Can walk independently without help.', ageInMonths: 15, category: 'Physical' },
      { title: 'Uses 3-5 words', description: 'Has a vocabulary of at least 3 to 5 words other than mama/dada.', ageInMonths: 15, category: 'Communication' },
      
      { title: 'Runs', description: 'Can run or walk very fast without falling often.', ageInMonths: 18, category: 'Physical' },
      { title: 'Eats with a spoon', description: 'Can feed themselves using a spoon.', ageInMonths: 18, category: 'Physical' }
    ];

    await StandardMilestone.insertMany(milestonesToCreate);
    console.log(`Successfully seeded ${milestonesToCreate.length} standard milestones!`);
    
    process.exit();
  } catch (error) {
    console.error('Error seeding standard milestones:', error);
    process.exit(1);
  }
};

seedStandardMilestones();

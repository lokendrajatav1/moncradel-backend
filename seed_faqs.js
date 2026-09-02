require('dotenv').config();
const mongoose = require('mongoose');
const Faq = require('./src/modules/faq/faq.model');

const faqs = [
  // Parent FAQs
  {
    question: 'How do I track my baby\'s growth?',
    answer: 'You can log your baby\'s height, weight, and head circumference in the Growth section to see percentiles and track progress over time.',
    targetApp: 'parent',
    category: 'general',
    isActive: true,
  },
  {
    question: 'How to order a meal subscription?',
    answer: 'Navigate to the Nutrition section, browse available meal plans for your child\'s age, and click Subscribe. You can choose weekly or monthly plans.',
    targetApp: 'parent',
    category: 'orders',
    isActive: true,
  },
  {
    question: 'Can I consult a doctor online?',
    answer: 'Yes, you can book video consultations with our verified pediatricians through the Doctors tab in your app.',
    targetApp: 'parent',
    category: 'health',
    isActive: true,
  },

  // Doctor FAQs
  {
    question: 'How do I update my consultation availability?',
    answer: 'Go to your Profile settings, select "Availability", and mark the hours you are open for online or clinic visits.',
    targetApp: 'doctor',
    category: 'general',
    isActive: true,
  },
  {
    question: 'When will I receive my consultation payouts?',
    answer: 'Payouts are processed weekly every Monday for all completed consultations from the previous week.',
    targetApp: 'doctor',
    category: 'general',
    isActive: true,
  },
  {
    question: 'How do I view patient history?',
    answer: 'Click on a patient\'s appointment card to view their complete Moncradle medical history, including past prescriptions and growth charts.',
    targetApp: 'doctor',
    category: 'health',
    isActive: true,
  },

  // Delivery FAQs
  {
    question: 'What do I do if the customer is not available?',
    answer: 'Try calling the customer twice. If there is no response, mark the order as "Customer Unavailable" in the app and return the meal to the kitchen.',
    targetApp: 'delivery',
    category: 'orders',
    isActive: true,
  },
  {
    question: 'How are my earnings calculated?',
    answer: 'Your earnings are based on a fixed base fare per delivery plus a distance-based fee. You can track daily earnings in the Wallet tab.',
    targetApp: 'delivery',
    category: 'general',
    isActive: true,
  },

  // Kitchen FAQs
  {
    question: 'When do I need to prepare the meal batches?',
    answer: 'The daily order batches are assigned by 5 AM. Please ensure all lunch batches are ready for pickup by 11:30 AM.',
    targetApp: 'kitchen',
    category: 'orders',
    isActive: true,
  },
  {
    question: 'How do I handle dietary restrictions?',
    answer: 'Special dietary requirements will be highlighted in red on the order card. Ensure these meals are prepared separately to avoid cross-contamination.',
    targetApp: 'kitchen',
    category: 'health',
    isActive: true,
  }
];

const seedFaqs = async () => {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Connected to MongoDB');

    console.log('Clearing old FAQs...');
    await Faq.deleteMany({});
    
    console.log('Seeding new FAQs...');
    await Faq.insertMany(faqs);
    
    console.log(`Successfully seeded ${faqs.length} FAQs!`);
    process.exit(0);
  } catch (error) {
    console.error('Error seeding FAQs:', error);
    process.exit(1);
  }
};

seedFaqs();

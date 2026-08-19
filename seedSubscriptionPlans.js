const mongoose = require('mongoose');
require('dotenv').config();

const SubscriptionPlan = require('./src/modules/subscriptionPlan/subscriptionPlan.model');

const seedPlans = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('MongoDB Connected...');

    await SubscriptionPlan.deleteMany({});
    console.log('Cleared existing subscription plans.');

    const plansToCreate = [
      {
        title: "Weekly Meals",
        price: 999,
        durationInDays: 7,
        description: "Perfect for trying out our fresh, nutritious baby meals.",
        features: [
          "7 Days of Fresh Meals",
          "Standard Delivery",
          "Basic Nutrition Tracking",
          "Cancel Anytime"
        ],
        isActive: true
      },
      {
        title: "Monthly Meals",
        price: 3499,
        durationInDays: 30,
        description: "Our most popular plan! Hassle-free nutrition for a whole month.",
        features: [
          "30 Days of Fresh Meals",
          "Priority Free Delivery",
          "Advanced Nutrition Insights",
          "1 Free Dietitian Consult",
          "Cancel Anytime"
        ],
        isActive: true
      },
      {
        title: "Consultation Pack",
        price: 1999,
        durationInDays: 180,
        description: "A bundle of 5 pediatric or nutritionist consultations.",
        features: [
          "5 Video Consultations",
          "Valid for 6 Months",
          "Access to Top Specialists",
          "Detailed Health Reports",
          "Priority Booking"
        ],
        isActive: true
      }
    ];

    await SubscriptionPlan.insertMany(plansToCreate);
    console.log(`Successfully seeded ${plansToCreate.length} subscription plans!`);
    
    process.exit();
  } catch (error) {
    console.error('Error seeding subscription plans:', error);
    process.exit(1);
  }
};

seedPlans();

const mongoose = require('mongoose');
require('dotenv').config();

const Meal = require('./src/modules/meal/meal.model');

const generateMeals = () => {
  const categories = ['Fruits', 'Vegetables', 'Cereals', 'Proteins', 'Dairy', 'Snacks'];
  const baseIngredients = ['Apple', 'Banana', 'Carrot', 'Peas', 'Sweet Potato', 'Oats', 'Rice', 'Chicken', 'Egg', 'Yogurt', 'Avocado', 'Spinach'];
  const ageGroups = ['0-6 months', '6-12 months', '1-3 years', '3+ years'];
  const descriptors = ['Puree', 'Mash', 'Bites', 'Soup', 'Porridge', 'Slices', 'Fingers'];

  const meals = [];
  
  for (let i = 1; i <= 100; i++) {
    const ing1 = baseIngredients[Math.floor(Math.random() * baseIngredients.length)];
    const ing2 = baseIngredients[Math.floor(Math.random() * baseIngredients.length)];
    const desc = descriptors[Math.floor(Math.random() * descriptors.length)];
    const category = categories[Math.floor(Math.random() * categories.length)];
    const age = ageGroups[Math.floor(Math.random() * ageGroups.length)];
    
    const price = Math.floor(Math.random() * 400) + 100; // random price between 100 and 500
    const hasDiscount = Math.random() > 0.5;
    const discountedPrice = hasDiscount ? price - Math.floor(Math.random() * (price * 0.3)) : price; // up to 30% discount

    meals.push({
      name: `${ing1} & ${ing2} ${desc}`,
      description: `Delicious and nutritious ${category.toLowerCase()} perfect for babies.`,
      suitableForAgeGroup: age,
      category: category,
      ingredients: [ing1, ing2, 'Water'],
      nutritionalInfo: { 
        calories: Math.floor(Math.random() * 150) + 50, 
        protein: Math.floor(Math.random() * 10) + 1, 
        carbs: Math.floor(Math.random() * 30) + 5, 
        fat: Math.floor(Math.random() * 5) 
      },
      price: price,
      discountedPrice: discountedPrice
    });
  }
  
  return meals;
};

const seedMoreMeals = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('MongoDB Connected...');

    // Clear existing
    await Meal.deleteMany({});
    console.log('Cleared existing meals.');

    const mealsToCreate = generateMeals();
    await Meal.insertMany(mealsToCreate);
    
    console.log(`Successfully seeded ${mealsToCreate.length} meals!`);
    
    process.exit();
  } catch (error) {
    console.error('Error seeding meals:', error);
    process.exit(1);
  }
};

seedMoreMeals();

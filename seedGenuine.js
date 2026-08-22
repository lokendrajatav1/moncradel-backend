const mongoose = require('mongoose');
require('dotenv').config({ path: 'f:/Dss-Project/moncradel/backend/.env' });

const Product = require('./src/modules/product/product.model');
const Meal = require('./src/modules/meal/meal.model');

const products = [
  { name: 'Ultra Soft Baby Diapers - Size 1', description: 'Gentle on baby skin, leak-proof diapers.', price: 499, discountedPrice: 449, category: 'diapers', stockQuantity: 100, brand: 'Pampers', ageGroup: '0-3 Months', isFeatured: true, imageUrl: '' },
  { name: 'Pure Water Baby Wipes', description: '99% water wipes, fragrance-free.', price: 199, discountedPrice: 179, category: 'care', stockQuantity: 200, brand: 'Huggies', ageGroup: '0-3 Years', isFeatured: false, imageUrl: '' },
  { name: 'Tear-Free Baby Shampoo', description: 'Mild and gentle tear-free formula.', price: 299, discountedPrice: 250, category: 'care', stockQuantity: 150, brand: 'Johnson & Johnson', ageGroup: '0-3 Years', isFeatured: true, imageUrl: '' },
  { name: 'Nourishing Baby Lotion', description: '24-hour moisture for delicate skin.', price: 349, discountedPrice: 299, category: 'care', stockQuantity: 120, brand: 'Aveeno', ageGroup: '0-3 Years', isFeatured: false, imageUrl: '' },
  { name: 'Anti-Colic Baby Bottle 150ml', description: 'Reduces colic and discomfort.', price: 599, discountedPrice: 499, category: 'feeding', stockQuantity: 80, brand: 'Philips Avent', ageGroup: '0-6 Months', isFeatured: true, imageUrl: '' },
  { name: 'Silicone Pacifier - 2 Pack', description: 'Orthodontic silicone pacifiers.', price: 299, discountedPrice: 249, category: 'accessories', stockQuantity: 100, brand: 'Chicco', ageGroup: '0-6 Months', isFeatured: false, imageUrl: '' },
  { name: 'Infant Formula Milk Powder Stage 1', description: 'Complete nutrition for infants.', price: 799, discountedPrice: 750, category: 'formula', stockQuantity: 50, brand: 'Nestle', ageGroup: '0-6 Months', isFeatured: true, imageUrl: '' },
  { name: 'Cotton Muslin Swaddle Blanket', description: 'Breathable 100% cotton swaddle.', price: 899, discountedPrice: 799, category: 'clothing', stockQuantity: 60, brand: 'Aden+Anais', ageGroup: '0-12 Months', isFeatured: false, imageUrl: '' },
  { name: 'Cooling Teether Toy', description: 'Soothes teething gums.', price: 249, discountedPrice: 199, category: 'toys', stockQuantity: 90, brand: 'MeeMee', ageGroup: '3-12 Months', isFeatured: false, imageUrl: '' },
  { name: 'Baby Massage Oil', description: 'Natural almond and olive oil blend.', price: 399, discountedPrice: 349, category: 'care', stockQuantity: 110, brand: 'Himalaya', ageGroup: '0-3 Years', isFeatured: true, imageUrl: '' },
  { name: 'Soft Bristle Baby Hairbrush', description: 'Gentle on baby scalp.', price: 149, discountedPrice: 129, category: 'care', stockQuantity: 80, brand: 'Chicco', ageGroup: '0-3 Years', isFeatured: false, imageUrl: '' },
  { name: 'Diaper Rash Cream', description: 'Zinc oxide formula for fast relief.', price: 249, discountedPrice: 220, category: 'care', stockQuantity: 150, brand: 'Desitin', ageGroup: '0-3 Years', isFeatured: true, imageUrl: '' },
  { name: 'Electric Breast Pump', description: 'Comfortable and efficient milk extraction.', price: 2499, discountedPrice: 2199, category: 'feeding', stockQuantity: 30, brand: 'Medela', ageGroup: 'Mothers', isFeatured: true, imageUrl: '' },
  { name: 'Organic Cotton Onesies - 3 Pack', description: 'Soft and breathable daily wear.', price: 999, discountedPrice: 899, category: 'clothing', stockQuantity: 70, brand: 'Carter\'s', ageGroup: '3-6 Months', isFeatured: false, imageUrl: '' },
  { name: 'Spill-Proof Sippy Cup', description: 'Easy grip transition cup.', price: 349, discountedPrice: 299, category: 'feeding', stockQuantity: 85, brand: 'Munchkin', ageGroup: '6-18 Months', isFeatured: false, imageUrl: '' },
  { name: 'Baby Food Processor', description: 'Steams and blends baby food.', price: 3999, discountedPrice: 3499, category: 'feeding', stockQuantity: 20, brand: 'Beaba', ageGroup: 'Mothers', isFeatured: true, imageUrl: '' },
  { name: 'Hypoallergenic Laundry Detergent', description: 'Tough on stains, gentle on skin.', price: 499, discountedPrice: 449, category: 'cleaning', stockQuantity: 100, brand: 'Pigeon', ageGroup: 'All Ages', isFeatured: false, imageUrl: '' },
  { name: 'Musical Crib Mobile', description: 'Soothes baby to sleep with soft tunes.', price: 1299, discountedPrice: 1099, category: 'toys', stockQuantity: 40, brand: 'Fisher-Price', ageGroup: '0-6 Months', isFeatured: true, imageUrl: '' },
  { name: 'Digital Baby Thermometer', description: 'Fast and accurate temperature reading.', price: 899, discountedPrice: 799, category: 'health', stockQuantity: 60, brand: 'Braun', ageGroup: 'All Ages', isFeatured: false, imageUrl: '' },
  { name: 'Baby Nail Clippers Set', description: 'Safe and precise trimming.', price: 199, discountedPrice: 179, category: 'care', stockQuantity: 120, brand: 'LuvLap', ageGroup: '0-3 Years', isFeatured: false, imageUrl: '' }
];

const meals = [
  { name: 'Organic Apple Puree', description: 'Smooth and sweet first food.', suitableForAgeGroup: '6-12 months', category: 'puree', ingredients: ['Organic Apples', 'Water'], nutritionalInfo: { calories: 50, protein: 0.2, carbs: 14, fat: 0 }, price: 99, discountedPrice: 89, tags: ['Organic', 'Vegan'], imageUrl: '' },
  { name: 'Carrot & Sweet Potato Mash', description: 'Vitamin-rich vegetable blend.', suitableForAgeGroup: '6-12 months', category: 'mash', ingredients: ['Carrots', 'Sweet Potato', 'Olive Oil'], nutritionalInfo: { calories: 70, protein: 1, carbs: 15, fat: 1 }, price: 110, discountedPrice: 99, tags: ['Vegetarian', 'Gluten-Free'], imageUrl: '' },
  { name: 'Banana & Oatmeal Breakfast', description: 'Filling morning meal for active babies.', suitableForAgeGroup: '6-12 months', category: 'cereal', ingredients: ['Oats', 'Banana', 'Breastmilk/Formula'], nutritionalInfo: { calories: 120, protein: 3, carbs: 22, fat: 2 }, price: 149, discountedPrice: 129, tags: ['Breakfast', 'High Fiber'], imageUrl: '' },
  { name: 'Pea & Spinach Puree', description: 'Iron-rich green goodness.', suitableForAgeGroup: '6-12 months', category: 'puree', ingredients: ['Peas', 'Spinach', 'Mint'], nutritionalInfo: { calories: 60, protein: 3, carbs: 10, fat: 0.5 }, price: 120, discountedPrice: 105, tags: ['Iron-Rich', 'Vegan'], imageUrl: '' },
  { name: 'Chicken & Rice Porridge', description: 'Savory protein-packed meal.', suitableForAgeGroup: '1-3 years', category: 'porridge', ingredients: ['Minced Chicken', 'Rice', 'Carrots', 'Broth'], nutritionalInfo: { calories: 150, protein: 8, carbs: 20, fat: 3 }, price: 199, discountedPrice: 179, tags: ['High Protein'], imageUrl: '' },
  { name: 'Avocado & Mango Smash', description: 'Creamy and sweet healthy fats.', suitableForAgeGroup: '6-12 months', category: 'mash', ingredients: ['Avocado', 'Mango'], nutritionalInfo: { calories: 110, protein: 1, carbs: 12, fat: 7 }, price: 140, discountedPrice: 120, tags: ['Healthy Fats', 'Raw'], imageUrl: '' },
  { name: 'Lentil & Vegetable Soup', description: 'Warm and comforting hearty soup.', suitableForAgeGroup: '1-3 years', category: 'soup', ingredients: ['Red Lentils', 'Tomato', 'Carrot', 'Celery'], nutritionalInfo: { calories: 130, protein: 6, carbs: 22, fat: 1 }, price: 160, discountedPrice: 145, tags: ['Vegetarian', 'Iron-Rich'], allergens: ['Celery'], imageUrl: '' },
  { name: 'Multigrain Baby Puffs', description: 'Perfect finger food for self-feeding.', suitableForAgeGroup: '1-3 years', category: 'snacks', ingredients: ['Whole Wheat', 'Rice Flour', 'Apple Juice'], nutritionalInfo: { calories: 80, protein: 2, carbs: 18, fat: 0 }, price: 249, discountedPrice: 220, tags: ['Finger Food', 'Snack'], allergens: ['Wheat'], imageUrl: '' },
  { name: 'Broccoli & Cheese Bites', description: 'Calcium-rich tasty bites.', suitableForAgeGroup: '1-3 years', category: 'snacks', ingredients: ['Broccoli', 'Cheddar Cheese', 'Egg', 'Breadcrumbs'], nutritionalInfo: { calories: 160, protein: 7, carbs: 12, fat: 8 }, price: 180, discountedPrice: 150, tags: ['Calcium-Rich', 'Finger Food'], allergens: ['Dairy', 'Egg', 'Wheat'], imageUrl: '' },
  { name: 'Pear & Plum Compote', description: 'Helps with digestion and constipation.', suitableForAgeGroup: '6-12 months', category: 'puree', ingredients: ['Pears', 'Plums'], nutritionalInfo: { calories: 65, protein: 0.5, carbs: 16, fat: 0 }, price: 115, discountedPrice: 100, tags: ['Digestive Health', 'Vegan'], imageUrl: '' },
  { name: 'Pumpkin & Cinnamon Mash', description: 'Autumn flavors packed with Vitamin A.', suitableForAgeGroup: '6-12 months', category: 'mash', ingredients: ['Pumpkin', 'Cinnamon'], nutritionalInfo: { calories: 55, protein: 1, carbs: 13, fat: 0.2 }, price: 105, discountedPrice: 95, tags: ['Vitamin A', 'Vegan'], imageUrl: '' },
  { name: 'Beef & Sweet Potato Stew', description: 'Rich in iron and zinc.', suitableForAgeGroup: '1-3 years', category: 'meal', ingredients: ['Lean Beef', 'Sweet Potato', 'Peas', 'Broth'], nutritionalInfo: { calories: 180, protein: 10, carbs: 18, fat: 6 }, price: 220, discountedPrice: 199, tags: ['High Iron', 'Protein'], imageUrl: '' },
  { name: 'Yogurt & Mixed Berry Drops', description: 'Probiotic-rich healthy snack.', suitableForAgeGroup: '1-3 years', category: 'snacks', ingredients: ['Greek Yogurt', 'Strawberries', 'Blueberries'], nutritionalInfo: { calories: 90, protein: 4, carbs: 14, fat: 2 }, price: 170, discountedPrice: 150, tags: ['Probiotics', 'Snack'], allergens: ['Dairy'], imageUrl: '' },
  { name: 'Salmon & Potato Mash', description: 'Omega-3 rich brain food.', suitableForAgeGroup: '1-3 years', category: 'mash', ingredients: ['Salmon', 'Potato', 'Dill'], nutritionalInfo: { calories: 140, protein: 9, carbs: 15, fat: 5 }, price: 250, discountedPrice: 220, tags: ['Omega-3', 'Brain Development'], allergens: ['Fish'], imageUrl: '' },
  { name: 'Quinoa & Apple Porridge', description: 'Complete plant-based protein.', suitableForAgeGroup: '6-12 months', category: 'porridge', ingredients: ['Quinoa', 'Apple', 'Water'], nutritionalInfo: { calories: 110, protein: 4, carbs: 20, fat: 1.5 }, price: 160, discountedPrice: 140, tags: ['Protein', 'Vegan'], imageUrl: '' },
  { name: 'Zucchini & Corn Fritters', description: 'Fun and tasty veggie patties.', suitableForAgeGroup: '1-3 years', category: 'snacks', ingredients: ['Zucchini', 'Sweet Corn', 'Flour', 'Egg'], nutritionalInfo: { calories: 130, protein: 4, carbs: 16, fat: 4 }, price: 140, discountedPrice: 120, tags: ['Vegetables', 'Finger Food'], allergens: ['Wheat', 'Egg'], imageUrl: '' },
  { name: 'Beetroot & Carrot Juice Blend', description: 'Immunity boosting colorful juice.', suitableForAgeGroup: '1-3 years', category: 'beverage', ingredients: ['Beetroot', 'Carrot', 'Apple'], nutritionalInfo: { calories: 70, protein: 1, carbs: 16, fat: 0 }, price: 90, discountedPrice: 80, tags: ['Immunity', 'Juice'], imageUrl: '' },
  { name: 'Whole Wheat Pasta with Tomato Sauce', description: 'Classic toddler favorite.', suitableForAgeGroup: '1-3 years', category: 'meal', ingredients: ['Whole Wheat Pasta', 'Tomato Puree', 'Basil', 'Olive Oil'], nutritionalInfo: { calories: 190, protein: 6, carbs: 32, fat: 4 }, price: 180, discountedPrice: 160, tags: ['Lunch', 'Carbs'], allergens: ['Wheat'], imageUrl: '' },
  { name: 'Oat & Raisin Cookies', description: 'Refined sugar-free treat.', suitableForAgeGroup: '3+ years', category: 'snacks', ingredients: ['Oats', 'Raisins', 'Banana', 'Coconut Oil'], nutritionalInfo: { calories: 150, protein: 3, carbs: 24, fat: 6 }, price: 200, discountedPrice: 180, tags: ['Healthy Treat', 'Sugar-Free'], imageUrl: '' },
  { name: 'Mashed Peas & Mint', description: 'Refreshing simple veggie side.', suitableForAgeGroup: '6-12 months', category: 'mash', ingredients: ['Green Peas', 'Mint Leaves'], nutritionalInfo: { calories: 50, protein: 3, carbs: 8, fat: 0 }, price: 95, discountedPrice: 85, tags: ['Vegetarian', 'Light'], imageUrl: '' }
];

async function seed() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');
    
    await Product.insertMany(products);
    console.log('Added 20 genuine products!');
    
    await Meal.insertMany(meals);
    console.log('Added 20 genuine meals!');
    
    process.exit(0);
  } catch (err) {
    console.error('Error seeding data:', err);
    process.exit(1);
  }
}
seed();

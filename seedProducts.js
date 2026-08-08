const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Product = require('./src/modules/product/product.model');

// Load env vars
dotenv.config();

const categories = ['diapers', 'formula', 'toys', 'bath', 'clothing', 'feeding', 'gear'];
const brands = ['Pampers', 'Huggies', 'MamyPoko', 'Nestle', 'Similac', 'Fisher-Price', 'Mee Mee', 'LuvLap', 'Mothercare', 'Sebamed', 'Himalaya', "Johnson's", 'Pigeon', 'Chicco'];
const adjectives = ['Premium', 'Soft', 'Gentle', 'Organic', 'Advanced', 'Classic', 'Pro', 'Ultimate', 'Comfort', 'Care'];
const ageGroups = ['0-6 months', '6-12 months', '1-2 years', '2-3 years'];

const generateProducts = () => {
  const products = [];
  for (let i = 1; i <= 100; i++) {
    const category = categories[Math.floor(Math.random() * categories.length)];
    const brand = brands[Math.floor(Math.random() * brands.length)];
    const adjective = adjectives[Math.floor(Math.random() * adjectives.length)];
    const ageGroup = ageGroups[Math.floor(Math.random() * ageGroups.length)];
    
    // Construct realistic name based on category
    let name = `${brand} ${adjective} `;
    if (category === 'diapers') name += 'Baby Diaper Pants';
    else if (category === 'formula') name += 'Infant Formula Powder';
    else if (category === 'toys') name += 'Musical Activity Toy';
    else if (category === 'bath') name += 'Tear-Free Baby Wash';
    else if (category === 'clothing') name += 'Cotton Onesie Set';
    else if (category === 'feeding') name += 'Anti-Colic Feeding Bottle';
    else if (category === 'gear') name += 'Lightweight Baby Stroller';
    
    name += ` (Pack of ${Math.floor(Math.random() * 3) + 1})`;

    const price = Math.floor(Math.random() * (3000 - 150 + 1)) + 150; // Random price between 150 and 3000
    const discountedPrice = Math.floor(price * (Math.random() * (0.9 - 0.7) + 0.7)); // 10% to 30% discount

    products.push({
      name,
      description: `High-quality ${category} product by ${brand}. Designed for ${ageGroup} babies with utmost care and safety standards.`,
      price,
      discountedPrice,
      category,
      stockQuantity: Math.floor(Math.random() * 500) + 20,
      imageUrl: `https://picsum.photos/seed/${i * 10}/400/400`, // Random placeholder image
      brand,
      sku: `${brand.substring(0,3).toUpperCase()}-${category.substring(0,3).toUpperCase()}-${1000 + i}`,
      ageGroup,
      isFeatured: Math.random() > 0.8, // 20% chance to be featured
      isActive: true
    });
  }
  return products;
};

const seedProducts = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB Connected...');

    await Product.deleteMany();
    console.log('Existing products cleared');

    const products = generateProducts();
    await Product.insertMany(products);
    console.log(`Successfully inserted ${products.length} dummy products!`);

    process.exit();
  } catch (error) {
    console.error('Error with seed:', error);
    process.exit(1);
  }
};

seedProducts();

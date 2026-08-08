const mongoose = require('mongoose');
require('dotenv').config();

const Order = require('./src/modules/order/order.model');
const User = require('./src/modules/user/user.model');
const Meal = require('./src/modules/meal/meal.model');
const Product = require('./src/modules/product/product.model');
const Baby = require('./src/modules/baby/baby.model');

const seedOrders = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('MongoDB Connected...');

    await Order.deleteMany({});
    console.log('Cleared existing orders.');

    const parents = await User.find({ role: 'parent' });
    const kitchens = await User.find({ role: 'kitchen' });
    const deliveryBoys = await User.find({ role: 'delivery' });
    
    const meals = await Meal.find({});
    const products = await Product.find({});
    const babies = await Baby.find({});

    if (parents.length === 0 || (meals.length === 0 && products.length === 0)) {
      console.log('Missing dependencies. Please ensure you have at least one parent, and one meal or product in the DB.');
      process.exit(1);
    }

    const statuses = ['pending', 'preparing', 'ready', 'out_for_delivery', 'delivered', 'cancelled'];
    
    const ordersToCreate = [];
    
    for (let i = 0; i < 150; i++) {
      const parent = parents[i % parents.length];
      const parentBaby = babies.find(b => b.parentId.toString() === parent._id.toString());
      const baby = parentBaby || (babies.length > 0 ? babies[0] : undefined);
      
      const isMeal = Math.random() > 0.3; // 70% meals, 30% products
      const meal = meals.length > 0 ? meals[i % meals.length] : undefined;
      const product = products.length > 0 ? products[i % products.length] : undefined;

      const item = isMeal && meal ? meal : product;
      if (!item) continue;

      const price = item.discountedPrice && item.discountedPrice > 0 ? item.discountedPrice : item.price;
      const status = statuses[i % statuses.length];

      const date = new Date();
      date.setDate(date.getDate() - (Math.floor(Math.random() * 30)));

      let kitchenId = undefined;
      let deliveryId = undefined;

      if (['preparing', 'ready', 'out_for_delivery', 'delivered'].includes(status) && kitchens.length > 0) {
        kitchenId = kitchens[i % kitchens.length]._id;
      }
      if (['out_for_delivery', 'delivered'].includes(status) && deliveryBoys.length > 0) {
        deliveryId = deliveryBoys[i % deliveryBoys.length]._id;
      }

      ordersToCreate.push({
        parentId: parent._id,
        babyId: baby ? baby._id : undefined,
        mealId: isMeal ? item._id : undefined,
        productId: !isMeal ? item._id : undefined,
        kitchenId,
        deliveryId,
        status: status,
        totalAmount: price,
        deliveryAddress: {
          street: `${100 + i} Main St`,
          city: 'Metropolis',
          state: 'NY',
          zipCode: '10001',
          phone: parent.phone || '555-0100'
        },
        createdAt: date.toISOString(),
      });
    }

    await Order.insertMany(ordersToCreate);
    console.log(`Successfully seeded ${ordersToCreate.length} orders!`);
    
    process.exit();
  } catch (error) {
    console.error('Error seeding orders:', error);
    process.exit(1);
  }
};

seedOrders();

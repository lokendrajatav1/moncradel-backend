require('dotenv').config();
const mongoose = require('mongoose');
const { Worker, Queue } = require('bullmq');
const redisConnection = require('./src/config/redis');
const Subscription = require('./src/modules/subscription/subscription.model');
const Order = require('./src/modules/order/order.model');

async function run() {
  await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/moncradel', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  console.log('Connected to DB. Triggering daily order generation...');

  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);
  
  const todayEnd = new Date();
  todayEnd.setHours(23, 59, 59, 999);

  const subscriptions = await Subscription.find({
    status: 'active',
    'deliverySchedule.date': { $gte: todayStart, $lte: todayEnd },
    'deliverySchedule.status': 'pending'
  });

  console.log(`Found ${subscriptions.length} active subscriptions for today.`);
  
  let generated = 0;
  for (let sub of subscriptions) {
    const todaysDeliveries = sub.deliverySchedule.filter(
      s => s.status === 'pending' && new Date(s.date) >= todayStart && new Date(s.date) <= todayEnd
    );

    for (let delivery of todaysDeliveries) {
      const orderItems = [{
        itemType: 'meal',
        mealId: delivery.mealId,
        quantity: 1,
        priceAtAddition: 0,
        timeSlot: delivery.timeSlot,
        specialInstructions: delivery.specialInstructions,
        status: 'pending',
        isSubscription: true
      }];

      const newOrder = await Order.create({
        parentId: sub.parentId,
        babyId: sub.babyId,
        mealSubscriptionId: sub._id,
        items: orderItems,
        totalAmount: 0, 
        paymentStatus: 'paid',
        paymentMethod: 'cod',
        status: 'pending'
      });

      delivery.status = 'ordered';
      delivery.orderId = newOrder._id;
      console.log(`Generated Order ${newOrder._id} for Subscription ${sub._id}`);
      generated++;
    }
    await sub.save();
  }
  
  console.log(`Done! Generated ${generated} orders.`);
  process.exit(0);
}

run();

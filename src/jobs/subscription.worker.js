const { Worker } = require('bullmq');
const redisConnection = require('../config/redis');
const Subscription = require('../modules/subscription/subscription.model');
const Order = require('../modules/order/order.model');
const Address = require('../modules/address/address.model');
const eventEmitter = require('../events/eventEmitter');

const worker = new Worker('SubscriptionQueue', async (job) => {
  if (job.name === 'generateDailyOrders') {
    console.log('Running Daily Subscription Order Generator via BullMQ...');
    try {
      const todayStart = new Date();
      todayStart.setHours(0, 0, 0, 0);

      const todayEnd = new Date();
      todayEnd.setHours(23, 59, 59, 999);

      // Find all active subscriptions with pending deliveries for today
      const subscriptions = await Subscription.find({
        status: 'active',
        'deliverySchedule.date': { $gte: todayStart, $lte: todayEnd },
        'deliverySchedule.status': 'pending'
      });

      console.log(`Found ${subscriptions.length} active subscriptions with deliveries today.`);

      for (let sub of subscriptions) {
        try {
          let addressData = null;
          if (sub.deliveryAddressId) {
            const address = await Address.findById(sub.deliveryAddressId);
            if (address) {
              addressData = {
                street: address.street,
                city: address.city,
                state: address.state,
                zipCode: address.zipCode,
                phone: address.phone
              };
            }
          }

          const todaysDeliveries = sub.deliverySchedule.filter(
            s => s.status === 'pending' && new Date(s.date) >= todayStart && new Date(s.date) <= todayEnd
          );

          for (let delivery of todaysDeliveries) {
            const itemType = delivery.mealId ? 'meal' : 'product';

            const orderItems = [{
              itemType,
              mealId: delivery.mealId,
              productId: delivery.productId,
              quantity: 1,
              priceAtAddition: 0,
              timeSlot: delivery.timeSlot,
              specialInstructions: delivery.specialInstructions,
              status: 'pending'
            }];

            const newOrder = await Order.create({
              parentId: sub.parentId,
              babyId: sub.babyId,
              mealSubscriptionId: sub._id,
              items: orderItems,
              totalAmount: 0,
              paymentStatus: 'paid',
              paymentMethod: 'cod',
              deliveryAddress: addressData || {},
              status: 'pending'
            });

            delivery.status = 'ordered';
            delivery.orderId = newOrder._id;

            console.log(`Generated Order ${newOrder._id} for Subscription ${sub._id}`);

            eventEmitter.emit('order.created', { order: newOrder });
          }

          await sub.save();
        } catch (err) {
          console.error(`Failed to process subscription ${sub._id}:`, err);
        }
      }

      console.log('Daily Subscription Order Generator finished successfully.');
      return { success: true, processed: subscriptions.length };
    } catch (error) {
      console.error('Error in Subscription Worker:', error);
      throw error;
    }
  }
}, {
  connection: redisConnection
});

worker.on('completed', (job) => {
  console.log(`Job [${job.id}] has completed!`);
});

worker.on('failed', (job, err) => {
  console.error(`Job [${job.id}] has failed with error: ${err.message}`);
});

module.exports = worker;

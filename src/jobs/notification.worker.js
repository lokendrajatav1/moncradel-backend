const { Worker } = require('bullmq');
const redisConnection = require('../config/redis');
const Notification = require('../modules/notification/notification.model');

// Process jobs from the NotificationQueue
const worker = new Worker('NotificationQueue', async (job) => {
  console.log(`Processing notification job [${job.id}] for: ${job.data.userId}`);
  
  try {
    // Save to database
    await Notification.create({
      userId: job.data.userId,
      title: job.data.title || 'New Notification',
      message: job.data.message,
      orderId: job.data.orderId
    });

    // Simulated async task (e.g., sending an email or push notification)
    await new Promise((resolve) => setTimeout(resolve, 2000));
    
    console.log(`Notification sent and saved for ${job.data.userId} with message: "${job.data.message}"`);
    return { success: true };
  } catch (error) {
    console.error(`Failed to process notification job [${job.id}]:`, error);
    throw error;
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

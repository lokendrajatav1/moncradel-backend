const { Worker } = require('bullmq');
const redisConnection = require('../config/redis');
const Notification = require('../modules/notification/notification.model');

const { sendPushNotification } = require('../config/firebase');

// Process jobs from the NotificationQueue
const worker = new Worker('NotificationQueue', async (job) => {
  console.log(`Processing notification job [${job.id}]`);

  try {
    if (job.data.isAdminBroadcast) {
      const User = require('../modules/user/user.model');
      const admins = await User.find({ role: 'admin' });
      const notifications = admins.map(admin => ({
        userId: admin._id,
        title: job.data.title || 'New System Notification',
        message: job.data.message,
        orderId: job.data.orderId
      }));

      if (notifications.length > 0) {
        await Notification.insertMany(notifications);
      }

      // Send Real-time Push Notification to Admins
      for (const admin of admins) {
        if (admin.fcmToken) {
          sendPushNotification(admin.fcmToken, job.data.title || 'New System Notification', job.data.message);
        }
      }

      console.log(`Sent notification to ${notifications.length} admins.`);
    } else {
      if (!job.data.userId) throw new Error('userId is required');

      // Save to database
      await Notification.create({
        userId: job.data.userId,
        title: job.data.title || 'New Notification',
        message: job.data.message,
        orderId: job.data.orderId
      });

      // Find user and send push notification
      const User = require('../modules/user/user.model');
      const user = await User.findById(job.data.userId);
      if (user && user.fcmToken) {
        sendPushNotification(user.fcmToken, job.data.title || 'New Notification', job.data.message);
      }

      console.log(`Notification sent and saved for ${job.data.userId} with message: "${job.data.message}"`);
    }

    // Simulated async task (e.g., sending an email or push notification)
    await new Promise((resolve) => setTimeout(resolve, 2000));
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

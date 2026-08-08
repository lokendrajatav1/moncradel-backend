const { Queue } = require('bullmq');
const redisConnection = require('../config/redis');

// Initialize the Notification Queue
const notificationQueue = new Queue('NotificationQueue', {
  connection: redisConnection
});

/**
 * Add a job to the notification queue
 * @param {Object} data - The data for the notification
 * @param {Object} opts - Optional BullMQ job options
 */
const addNotificationJob = async (data, opts = {}) => {
  return await notificationQueue.add('sendNotification', data, {
    attempts: 3,
    backoff: {
      type: 'exponential',
      delay: 1000
    },
    ...opts
  });
};

module.exports = {
  notificationQueue,
  addNotificationJob
};

const { Queue } = require('bullmq');
const redisConnection = require('../config/redis');

const subscriptionQueue = new Queue('SubscriptionQueue', {
  connection: redisConnection
});

const scheduleDailySubscriptionJob = async () => {
  // Remove existing repeatable jobs with the same name to avoid duplicates
  const repeatableJobs = await subscriptionQueue.getRepeatableJobs();
  for (const job of repeatableJobs) {
    if (job.name === 'generateDailyOrders') {
      await subscriptionQueue.removeRepeatableByKey(job.key);
    }
  }

  // Add the repeatable job (runs every day at 00:01)
  await subscriptionQueue.add('generateDailyOrders', {}, {
    repeat: {
      pattern: '1 0 * * *',
      tz: 'Asia/Kolkata'
    }
  });
  console.log('Daily subscription job scheduled in BullMQ.');
};

module.exports = {
  subscriptionQueue,
  scheduleDailySubscriptionJob
};

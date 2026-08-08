const IORedis = require('ioredis');

// Parse the REDIS_URI (e.g. redis://localhost:6379)
const connection = new IORedis(process.env.REDIS_URI, {
  maxRetriesPerRequest: null,
});

connection.on('error', (err) => {
  console.error('Redis Connection Error:', err);
});

module.exports = connection;

const dotenv = require('dotenv');
const http = require('http');
const connectDB = require('./database/connection');
const app = require('./app');
const initSockets = require('./sockets/socket');

// Load env vars
dotenv.config();

// Port configuration
const PORT = process.env.PORT || 5000;

// Connect to Database
connectDB();

// Initialize BullMQ Workers
require('./jobs/notification.worker');

// Create HTTP Server and Initialize Socket.io
const server = http.createServer(app);
const io = initSockets(server);

// Make io accessible globally via the app object
app.set('io', io);

server.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});

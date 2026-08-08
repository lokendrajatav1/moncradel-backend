const { Server } = require('socket.io');
const jwt = require('jsonwebtoken');

const initSockets = (server) => {
  const io = new Server(server, {
    cors: {
      origin: "*", // Allow all origins for development
      methods: ["GET", "POST"]
    }
  });

  // Authentication Middleware for Socket.io
  io.use((socket, next) => {
    try {
      const token = socket.handshake.auth.token;
      if (!token) {
        return next(new Error('Authentication error: Token missing'));
      }
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      socket.user = decoded; // Attach user info to the socket
      next();
    } catch (err) {
      next(new Error('Authentication error: Invalid token'));
    }
  });

  io.on('connection', (socket) => {
    console.log(`Socket connected: ${socket.id} (User ID: ${socket.user.id})`);

    // Listen for users joining a specific order room (e.g. parent tracking an order)
    socket.on('join_order_room', (orderId) => {
      socket.join(`order_${orderId}`);
      console.log(`User ${socket.user.id} joined room order_${orderId}`);
    });

    // Listen for users joining a specific support ticket room
    socket.on('join_ticket_room', (ticketId) => {
      socket.join(`ticket_${ticketId}`);
      console.log(`User ${socket.user.id} joined room ticket_${ticketId}`);
    });

    // Listen for location updates from delivery drivers and broadcast them to the room
    socket.on('location_update', (data) => {
      // data should contain { orderId, latitude, longitude }
      io.to(`order_${data.orderId}`).emit('driver_location', {
        latitude: data.latitude,
        longitude: data.longitude,
        timestamp: new Date()
      });
    });

    socket.on('disconnect', () => {
      console.log(`Socket disconnected: ${socket.id}`);
    });
  });

  return io;
};

module.exports = initSockets;

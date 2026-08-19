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
  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth.token;
      if (!token) {
        return next(new Error('Authentication error: Token missing'));
      }
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      
      // Fetch user from DB to get role since it's not in the token
      const User = require('../modules/user/user.model');
      const user = await User.findById(decoded.id).select('role');
      
      socket.user = { id: decoded.id, role: user ? user.role : 'user' };
      next();
    } catch (err) {
      next(new Error('Authentication error: Invalid token'));
    }
  });

  io.on('connection', (socket) => {
    console.log(`Socket connected: ${socket.id} (User ID: ${socket.user.id}, Role: ${socket.user.role})`);

    if (socket.user.role === 'admin') {
      socket.join('admin_room');
      console.log(`Admin ${socket.user.id} joined admin_room`);
    }

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

    socket.on('mark_as_read', async (ticketId) => {
      try {
        const supportService = require('../modules/support/support.service');
        const userRole = socket.user.role === 'admin' ? 'admin' : 'user';
        const updatedTicket = await supportService.markAsRead(ticketId, userRole);
        socket.to(`ticket_${ticketId}`).emit('ticket_reply', updatedTicket); // to others in room
        socket.emit('ticket_reply', updatedTicket); // back to sender
      } catch (error) {
        console.error('Socket mark_as_read error:', error);
      }
    });

    socket.on('send_reply', async ({ ticketId, message, status, quotedReplyId }) => {
      try {
        const supportService = require('../modules/support/support.service');
        const sender = socket.user.role === 'admin' ? 'admin' : 'user';
        const updatedTicket = await supportService.replyToTicket(ticketId, sender, message, status, quotedReplyId);
        socket.to(`ticket_${ticketId}`).emit('ticket_reply', updatedTicket); // to others in room
        socket.emit('ticket_reply', updatedTicket); // back to sender
      } catch (error) {
        console.error('Socket send_reply error:', error);
      }
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

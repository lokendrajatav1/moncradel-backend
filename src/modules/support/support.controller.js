const supportService = require('./support.service');

// @desc    Create a support ticket
// @route   POST /api/support
// @access  Private
const createTicket = async (req, res, next) => {
  try {
    const ticket = await supportService.createTicket(req.user._id, req.body);
    res.status(201).json({ success: true, data: ticket });
  } catch (error) {
    next(error);
  }
};

// @desc    Get support tickets
// @route   GET /api/support
// @access  Private
const getTickets = async (req, res, next) => {
  try {
    const { tickets, count } = await supportService.getTickets(req.user.role, req.user._id, req.query);
    res.status(200).json({ success: true, count, data: tickets });
  } catch (error) {
    next(error);
  }
};

// @desc    Reply to a support ticket
// @route   PUT /api/support/:id/reply
// @access  Private
const replyToTicket = async (req, res, next) => {
  try {
    const { message, status, quotedReplyId } = req.body;
    const sender = req.user.role === 'admin' ? 'admin' : 'user';
    const ticket = await supportService.replyToTicket(req.params.id, sender, message, status, quotedReplyId);
    
    // Broadcast the update to anyone in the ticket's room
    const io = req.app.get('io');
    if (io) {
      io.to(`ticket_${ticket._id}`).emit('ticket_reply', ticket);
    }
    
    res.status(200).json({ success: true, data: ticket });
  } catch (error) {
    next(error);
  }
};

// @desc    Edit a support ticket reply
// @route   PUT /api/support/:id/reply/:replyId
// @access  Private
const editReply = async (req, res, next) => {
  try {
    const { message } = req.body;
    const ticket = await supportService.editReply(req.params.id, req.params.replyId, message, req.user._id, req.user.role);
    
    const io = req.app.get('io');
    if (io) {
      io.to(`ticket_${ticket._id}`).emit('ticket_reply', ticket);
    }
    
    res.status(200).json({ success: true, data: ticket });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a support ticket reply
// @route   DELETE /api/support/:id/reply/:replyId
// @access  Private
const deleteReply = async (req, res, next) => {
  try {
    const ticket = await supportService.deleteReply(req.params.id, req.params.replyId, req.user._id, req.user.role);
    
    const io = req.app.get('io');
    if (io) {
      io.to(`ticket_${ticket._id}`).emit('ticket_reply', ticket);
    }
    
    res.status(200).json({ success: true, data: ticket });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createTicket,
  getTickets,
  replyToTicket,
  editReply,
  deleteReply
};

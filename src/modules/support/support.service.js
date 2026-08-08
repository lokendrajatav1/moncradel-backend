const Support = require('./support.model');

/**
 * Create a new support ticket
 */
const createTicket = async (userId, ticketData) => {
  const { issueType, description, orderId } = ticketData;

  const ticket = await Support.create({
    userId,
    issueType,
    description,
    orderId
  });

  return ticket;
};

/**
 * Get support tickets based on user role
 */
const getTickets = async (userRole, userId, queryParams = {}) => {
  const filters = {};
  // Users only see their tickets. Admin sees all.
  if (userRole !== 'admin') {
    filters.userId = userId;
  }

  if (queryParams.search) {
    const User = require('../user/user.model');
    const matchedUsers = await User.find({
      name: { $regex: queryParams.search, $options: 'i' }
    }).select('_id');
    const userIds = matchedUsers.map(u => u._id);
    
    filters.$or = [
      { issueType: { $regex: queryParams.search, $options: 'i' } },
      { description: { $regex: queryParams.search, $options: 'i' } },
      { userId: { $in: userIds } }
    ];
  }

  const page = parseInt(queryParams.page, 10) || 1;
  const limit = parseInt(queryParams.limit, 10) || 10;
  const skip = (page - 1) * limit;

  const count = await Support.countDocuments(filters);
  const tickets = await Support.find(filters)
    .populate('userId', 'name email role phone')
    .populate('orderId', 'orderNumber status')
    .sort('-createdAt')
    .skip(skip)
    .limit(limit);

  return { tickets, count };
};

/**
 * Add a reply to a support ticket and update its status
 */
const replyToTicket = async (ticketId, sender, message, newStatus, quotedReplyId) => {
  const ticket = await Support.findById(ticketId);
  if (!ticket) throw new Error('Ticket not found');

  ticket.replies.push({ sender, message, quotedReplyId });
  
  if (newStatus) {
    ticket.status = newStatus;
  } else if (ticket.status === 'open' && sender === 'admin') {
    ticket.status = 'in_progress';
  }

  await ticket.save();
  
  return await Support.findById(ticketId)
    .populate('userId', 'name email role phone')
    .populate('orderId', 'orderNumber status');
};

/**
 * Edit a specific reply
 */
const editReply = async (ticketId, replyId, newMessage, userId, userRole) => {
  const ticket = await Support.findById(ticketId);
  if (!ticket) throw new Error('Ticket not found');

  const reply = ticket.replies.id(replyId);
  if (!reply) throw new Error('Reply not found');

  // Authorization check (optional: only sender or admin can edit)
  if (userRole !== 'admin' && reply.sender !== 'user') {
    throw new Error('Not authorized to edit this reply');
  }

  reply.message = newMessage;
  reply.isEdited = true;
  await ticket.save();

  return await Support.findById(ticketId)
    .populate('userId', 'name email role phone')
    .populate('orderId', 'orderNumber status');
};

/**
 * Delete a specific reply
 */
const deleteReply = async (ticketId, replyId, userId, userRole) => {
  const ticket = await Support.findById(ticketId);
  if (!ticket) throw new Error('Ticket not found');

  const reply = ticket.replies.id(replyId);
  if (!reply) throw new Error('Reply not found');

  // Authorization check
  if (userRole !== 'admin' && reply.sender !== 'user') {
    throw new Error('Not authorized to delete this reply');
  }

  reply.isDeleted = true;
  reply.message = '🚫 This message was deleted';
  await ticket.save();

  return await Support.findById(ticketId)
    .populate('userId', 'name email role phone')
    .populate('orderId', 'orderNumber status');
};

module.exports = {
  createTicket,
  getTickets,
  replyToTicket,
  editReply,
  deleteReply
};

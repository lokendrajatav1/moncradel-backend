const Notification = require('./notification.model');
const Broadcast = require('./broadcast.model');
const User = require('../user/user.model');
const Subscription = require('../subscription/subscription.model');

/**
 * Get user notifications
 */
const getNotifications = async (userId) => {
  return await Notification.find({ userId })
    .sort('-createdAt')
    .limit(50); // Get last 50 notifications
};

/**
 * Mark notification as read
 */
const markAsRead = async (userId, notificationId) => {
  const notification = await Notification.findOneAndUpdate(
    { _id: notificationId, userId },
    { isRead: true },
    { new: true }
  );

  if (!notification) throw new Error('Notification not found');
  return notification;
};

/**
 * Delete a user notification
 */
const deleteNotification = async (userId, notificationId) => {
  const notification = await Notification.findOneAndDelete({ 
    _id: notificationId, 
    userId 
  });

  if (!notification) throw new Error('Notification not found');
  return notification;
};

/**
 * Send a broadcast notification to a specific audience
 */
const sendBroadcast = async (broadcastData) => {
  const { title, message, audience } = broadcastData;
  let query = { isActive: true };

  if (audience === 'Parents Only') {
    query.role = 'parent';
  } else if (audience === 'Doctors Only') {
    query.role = 'doctor';
  } else if (audience === 'Kitchen Staff Only') {
    query.role = 'kitchen';
  } else if (audience === 'Delivery Drivers Only') {
    query.role = 'delivery';
  } else if (audience === 'Active Subscribers') {
    // Find all active subscriptions that haven't expired
    const activeSubscriptions = await Subscription.find({
      status: 'active',
      endDate: { $gte: new Date() }
    }).distinct('parentId');
    
    // Target users who have those active subscriptions
    query._id = { $in: activeSubscriptions };
  }

  const users = await User.find(query).select('_id');
  
  if (users.length === 0) {
    throw new Error('No users found for this audience');
  }

  // Create a broadcast record
  const broadcast = await Broadcast.create({
    title,
    message,
    audience,
    sentCount: users.length,
    status: 'Delivered'
  });

  // Bulk insert notifications
  const notificationsToInsert = users.map(u => ({
    userId: u._id,
    title,
    message,
    isRead: false
  }));

  await Notification.insertMany(notificationsToInsert);
  return broadcast;
};

/**
 * Get broadcast history
 */
const getBroadcastHistory = async () => {
  return await Broadcast.find().sort('-createdAt');
};

/**
 * Delete a broadcast
 */
const deleteBroadcast = async (broadcastId) => {
  const broadcast = await Broadcast.findById(broadcastId);
  if (!broadcast) throw new Error('Broadcast not found');
  await broadcast.deleteOne();
  return broadcast;
};

module.exports = {
  getNotifications,
  markAsRead,
  deleteNotification,
  sendBroadcast,
  getBroadcastHistory,
  deleteBroadcast
};

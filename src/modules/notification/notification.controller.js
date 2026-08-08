const notificationService = require('./notification.service');

// @desc    Get user notifications
// @route   GET /api/notifications
// @access  Private
const getNotifications = async (req, res, next) => {
  try {
    const notifications = await notificationService.getNotifications(req.user._id);
    res.status(200).json({ success: true, count: notifications.length, data: notifications });
  } catch (error) {
    next(error);
  }
};

// @desc    Mark notification as read
// @route   PATCH /api/notifications/:id/read
// @access  Private
const markAsRead = async (req, res, next) => {
  try {
    const notification = await notificationService.markAsRead(req.user._id, req.params.id);
    res.status(200).json({ success: true, data: notification });
  } catch (error) {
    if (error.message === 'Notification not found') {
      return res.status(404).json({ success: false, message: 'Notification not found' });
    }
    next(error);
  }
};

// @desc    Delete user notification
// @route   DELETE /api/notifications/:id
// @access  Private
const deleteNotification = async (req, res, next) => {
  try {
    await notificationService.deleteNotification(req.user._id, req.params.id);
    res.status(200).json({ success: true, data: {} });
  } catch (error) {
    if (error.message === 'Notification not found') {
      return res.status(404).json({ success: false, message: 'Notification not found' });
    }
    next(error);
  }
};

// @desc    Send a broadcast notification
// @route   POST /api/notifications/broadcast
// @access  Private (Admin)
const sendBroadcast = async (req, res, next) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    const broadcast = await notificationService.sendBroadcast(req.body);
    res.status(201).json({ success: true, data: broadcast });
  } catch (error) {
    if (error.message === 'No users found for this audience') {
      return res.status(400).json({ success: false, message: error.message });
    }
    next(error);
  }
};

// @desc    Get broadcast history
// @route   GET /api/notifications/broadcast
// @access  Private (Admin)
const getBroadcastHistory = async (req, res, next) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    const broadcasts = await notificationService.getBroadcastHistory();
    res.status(200).json({ success: true, count: broadcasts.length, data: broadcasts });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a broadcast
// @route   DELETE /api/notifications/broadcast/:id
// @access  Private (Admin)
const deleteBroadcast = async (req, res, next) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    await notificationService.deleteBroadcast(req.params.id);
    res.status(200).json({ success: true, data: {} });
  } catch (error) {
    if (error.message === 'Broadcast not found') {
      return res.status(404).json({ success: false, message: 'Broadcast not found' });
    }
    next(error);
  }
};

module.exports = {
  getNotifications,
  markAsRead,
  sendBroadcast,
  getBroadcastHistory,
  deleteBroadcast,
  deleteNotification
};

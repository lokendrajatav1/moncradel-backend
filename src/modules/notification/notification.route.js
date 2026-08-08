const express = require('express');
const router = express.Router();
const { getNotifications, markAsRead, sendBroadcast, getBroadcastHistory, deleteBroadcast, deleteNotification } = require('./notification.controller');
const { protect } = require('../../middleware/auth');
const validate = require('../../middleware/validate');
const { broadcastSchema } = require('./notification.validation');

// Broadcast routes (Admin only)
router.route('/broadcast')
  .post(protect, validate(broadcastSchema), sendBroadcast)
  .get(protect, getBroadcastHistory);

router.route('/broadcast/:id')
  .delete(protect, deleteBroadcast);

// Individual notification routes
router.route('/')
  .get(protect, getNotifications);

router.route('/:id/read')
  .patch(protect, markAsRead);

router.route('/:id')
  .delete(protect, deleteNotification);

module.exports = router;

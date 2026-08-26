const express = require('express');
const {
  punchIn,
  punchOut,
  getMyAttendance,
  getKitchenAttendance,
  updateAttendance
} = require('./attendance.controller');
const { protect, authorize } = require('../../middleware/auth');

const router = express.Router();

router.use(protect);

// Staff specific routes
router.post('/punch-in', authorize('kitchen_staff'), punchIn);
router.post('/punch-out', authorize('kitchen_staff'), punchOut);
router.get('/me', authorize('kitchen_staff'), getMyAttendance);

// Admin specific routes
router.get('/', authorize('kitchen'), getKitchenAttendance);
router.put('/:id', authorize('kitchen'), updateAttendance);

module.exports = router;

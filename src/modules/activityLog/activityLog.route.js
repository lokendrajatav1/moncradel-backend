const express = require('express');
const router = express.Router();
const { logActivity, getActivityLogs, deleteActivityLog, updateActivityLog } = require('./activityLog.controller');
const { protect, authorize } = require('../../middleware/auth');
const validate = require('../../middleware/validate');
const { logActivitySchema, updateActivityLogSchema } = require('./activityLog.validation');

router.route('/')
  .post(protect, authorize('admin', 'doctor', 'parent'), validate(logActivitySchema), logActivity);

router.route('/baby/:babyId')
  .get(protect, authorize('admin', 'doctor', 'parent'), getActivityLogs);

router.route('/:id')
  .put(protect, authorize('admin', 'doctor', 'parent'), validate(updateActivityLogSchema), updateActivityLog)
  .delete(protect, authorize('admin', 'doctor', 'parent'), deleteActivityLog);

module.exports = router;

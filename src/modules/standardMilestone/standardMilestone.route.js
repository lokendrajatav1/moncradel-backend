const express = require('express');
const router = express.Router();
const {
  createStandardMilestone,
  getStandardMilestones,
  updateStandardMilestone,
  deleteStandardMilestone
} = require('./standardMilestone.controller');
const { protect, authorize } = require('../../middleware/auth');
const validate = require('../../middleware/validate');
const { standardMilestoneSchema, updateStandardMilestoneSchema } = require('./standardMilestone.validation');

// Anyone logged in can get the standard milestones
router.route('/')
  .get(protect, getStandardMilestones)
  .post(protect, authorize('admin'), validate(standardMilestoneSchema), createStandardMilestone);

router.route('/:id')
  .put(protect, authorize('admin'), validate(updateStandardMilestoneSchema), updateStandardMilestone)
  .delete(protect, authorize('admin'), deleteStandardMilestone);

module.exports = router;

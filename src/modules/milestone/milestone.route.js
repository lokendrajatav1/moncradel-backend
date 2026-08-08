const express = require('express');
const router = express.Router();
const { addMilestone, getMilestones, updateMilestone, deleteMilestone } = require('./milestone.controller');
const { protect } = require('../../middleware/auth');
const upload = require('../../middleware/upload');
const validate = require('../../middleware/validate');
const { addMilestoneSchema } = require('./milestone.validation');

router.route('/')
  .post(protect, upload.single('photo'), validate(addMilestoneSchema), addMilestone);

router.route('/:babyId')
  .get(protect, getMilestones);

router.route('/:id')
  .put(protect, upload.single('photo'), validate(addMilestoneSchema), updateMilestone)
  .delete(protect, deleteMilestone);

module.exports = router;

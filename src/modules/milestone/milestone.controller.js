const milestoneService = require('./milestone.service');

// @desc    Add a milestone
// @route   POST /api/milestones
// @access  Private (Parent)
const addMilestone = async (req, res, next) => {
  try {
    const milestone = await milestoneService.addMilestone(req.body, req.file);
    res.status(201).json({ success: true, data: milestone });
  } catch (error) {
    next(error);
  }
};

// @desc    Get milestones for a baby
// @route   GET /api/milestones/:babyId
// @access  Private
const getMilestones = async (req, res, next) => {
  try {
    const milestones = await milestoneService.getMilestones(req.params.babyId);
    res.status(200).json({ success: true, count: milestones.length, data: milestones });
  } catch (error) {
    next(error);
  }
};

// @desc    Update a milestone
// @route   PUT /api/milestones/:id
// @access  Private
const updateMilestone = async (req, res, next) => {
  try {
    const milestone = await milestoneService.updateMilestone(req.params.id, req.body, req.file);
    res.status(200).json({ success: true, data: milestone });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a milestone
// @route   DELETE /api/milestones/:id
// @access  Private
const deleteMilestone = async (req, res, next) => {
  try {
    await milestoneService.deleteMilestone(req.params.id);
    res.status(200).json({ success: true, data: {} });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  addMilestone,
  getMilestones,
  updateMilestone,
  deleteMilestone
};

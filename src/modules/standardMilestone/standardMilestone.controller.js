const StandardMilestone = require('./standardMilestone.model');

// @desc    Create a new standard milestone
// @route   POST /api/v1/standard-milestones
// @access  Private/Admin
const createStandardMilestone = async (req, res) => {
  try {
    const milestone = await StandardMilestone.create(req.body);
    res.status(201).json({
      success: true,
      data: milestone
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get all standard milestones
// @route   GET /api/v1/standard-milestones
// @access  Private
const getStandardMilestones = async (req, res) => {
  try {
    const query = {};
    if (req.query.category) {
      query.category = req.query.category;
    }
    if (req.query.ageInMonths) {
      query.ageInMonths = req.query.ageInMonths;
    }
    
    // Sort by age ascending by default
    const milestones = await StandardMilestone.find(query).sort({ ageInMonths: 1 });
    
    res.status(200).json({
      success: true,
      count: milestones.length,
      data: milestones
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update standard milestone
// @route   PUT /api/v1/standard-milestones/:id
// @access  Private/Admin
const updateStandardMilestone = async (req, res) => {
  try {
    let milestone = await StandardMilestone.findById(req.params.id);
    
    if (!milestone) {
      return res.status(404).json({ success: false, message: 'Milestone not found' });
    }

    milestone = await StandardMilestone.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    res.status(200).json({
      success: true,
      data: milestone
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete standard milestone
// @route   DELETE /api/v1/standard-milestones/:id
// @access  Private/Admin
const deleteStandardMilestone = async (req, res) => {
  try {
    const milestone = await StandardMilestone.findById(req.params.id);
    
    if (!milestone) {
      return res.status(404).json({ success: false, message: 'Milestone not found' });
    }

    await milestone.deleteOne();

    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  createStandardMilestone,
  getStandardMilestones,
  updateStandardMilestone,
  deleteStandardMilestone
};

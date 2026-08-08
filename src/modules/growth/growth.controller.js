const growthService = require('./growth.service');

// @desc    Add a growth record
// @route   POST /api/growth
// @access  Private (Doctor or Parent)
const addGrowthRecord = async (req, res, next) => {
  try {
    const userId = req.user._id || req.user.id;
    const record = await growthService.addGrowthRecord(userId, req.body);
    res.status(201).json({ success: true, data: record });
  } catch (error) {
    next(error);
  }
};

// @desc    Get growth records for a baby
// @route   GET /api/growth/:babyId
// @access  Private
const getGrowthRecords = async (req, res, next) => {
  try {
    const records = await growthService.getGrowthRecords(req.params.babyId);
    res.status(200).json({ success: true, count: records.length, data: records });
  } catch (error) {
    next(error);
  }
};

// @desc    Update a growth record
// @route   PUT /api/growth/:id
// @access  Private
const updateGrowthRecord = async (req, res, next) => {
  try {
    const record = await growthService.updateGrowthRecord(req.params.id, req.body);
    res.status(200).json({ success: true, data: record });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a growth record
// @route   DELETE /api/growth/:id
// @access  Private
const deleteGrowthRecord = async (req, res, next) => {
  try {
    await growthService.deleteGrowthRecord(req.params.id);
    res.status(200).json({ success: true, data: {} });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  addGrowthRecord,
  getGrowthRecords,
  updateGrowthRecord,
  deleteGrowthRecord
};

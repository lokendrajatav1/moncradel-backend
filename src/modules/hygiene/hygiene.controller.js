const hygieneService = require('./hygiene.service');

// @desc    Log a hygiene task
// @route   POST /api/hygiene
// @access  Private (Kitchen)
const logHygieneTask = async (req, res, next) => {
  try {
    if (req.user.role !== 'kitchen' && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    let targetKitchenId = req.user._id || req.user.id;
    // If admin is creating the task, they can specify the kitchenId
    if (req.user.role === 'admin' && req.body.kitchenId) {
      targetKitchenId = req.body.kitchenId;
    }

    const log = await hygieneService.logHygieneTask(targetKitchenId, req.body, req.file);
    res.status(201).json({ success: true, data: log });
  } catch (error) {
    next(error);
  }
};

// @desc    Get hygiene logs
// @route   GET /api/hygiene
// @access  Private
const getHygieneLogs = async (req, res, next) => {
  try {
    // Enforce kitchenId filtering for kitchen partners
    if (req.user.role === 'kitchen') {
      req.query.kitchenId = req.user._id || req.user.id;
    }

    const result = await hygieneService.getHygieneLogs(req.query);
    res.status(200).json({ 
      success: true, 
      count: result.logs.length, 
      pagination: result.pagination, 
      data: result.logs 
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update a hygiene task
// @route   PUT /api/hygiene/:id
// @access  Private (Kitchen/Admin)
const updateHygieneTask = async (req, res, next) => {
  try {
    if (req.user.role !== 'kitchen' && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    const log = await hygieneService.updateHygieneTask(req.params.id, req.body, req.file);
    res.status(200).json({ success: true, data: log });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a hygiene task
// @route   DELETE /api/hygiene/:id
// @access  Private (Kitchen/Admin)
const deleteHygieneTask = async (req, res, next) => {
  try {
    if (req.user.role !== 'kitchen' && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    await hygieneService.deleteHygieneTask(req.params.id);
    res.status(200).json({ success: true, data: {} });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  logHygieneTask,
  getHygieneLogs,
  updateHygieneTask,
  deleteHygieneTask
};

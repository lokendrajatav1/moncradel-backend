const batchService = require('./batch.service');

// @desc    Create a new batch from pending orders
// @route   POST /api/batches
// @access  Private (Kitchen / Admin)
const createBatch = async (req, res, next) => {
  try {
    if (!['kitchen', 'admin', 'superadmin'].includes(req.user.role)) {
      return res.status(403).json({ success: false, message: 'Not authorized to manage batches' });
    }

    const batch = await batchService.createBatch(req.user._id, req.body);
    res.status(201).json({ success: true, data: batch });
  } catch (error) {
    next(error);
  }
};

// @desc    Update batch status (and automatically update orders!)
// @route   PATCH /api/batches/:id/status
// @access  Private (Kitchen / Admin)
const updateBatchStatus = async (req, res, next) => {
  try {
    if (!['kitchen', 'admin', 'superadmin'].includes(req.user.role)) {
      return res.status(403).json({ success: false, message: 'Not authorized to manage batches' });
    }

    const io = req.app.get('io');
    const batch = await batchService.updateBatchStatus(req.params.id, req.body, io);
    res.status(200).json({ success: true, data: batch });
  } catch (error) {
    if (error.message === 'Batch not found') {
      return res.status(404).json({ success: false, message: 'Batch not found' });
    }
    next(error);
  }
};

// @desc    Get all batches
// @route   GET /api/batches
// @access  Private
const getBatches = async (req, res, next) => {
  try {
    if (req.user && req.user.role === 'kitchen') {
      req.query.kitchenId = req.user._id || req.user.id;
    }

    const result = await batchService.getBatches(req.query);
    res.status(200).json({ 
      success: true, 
      count: result.batches.length, 
      pagination: result.pagination,
      data: result.batches 
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a batch (only if status is 'pending')
// @route   DELETE /api/batches/:id
// @access  Private (Kitchen / Admin)
const deleteBatch = async (req, res, next) => {
  try {
    if (!['kitchen', 'admin', 'superadmin'].includes(req.user.role)) {
      return res.status(403).json({ success: false, message: 'Not authorized to manage batches' });
    }

    const result = await batchService.deleteBatch(req.params.id);
    res.status(200).json({ success: true, message: result.message });
  } catch (error) {
    if (error.message === 'Batch not found') {
      return res.status(404).json({ success: false, message: 'Batch not found' });
    }
    if (error.message.includes('Only pending batches')) {
      return res.status(400).json({ success: false, message: error.message });
    }
    next(error);
  }
};

module.exports = {
  createBatch,
  updateBatchStatus,
  getBatches,
  deleteBatch
};

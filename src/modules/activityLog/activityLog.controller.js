const ActivityLog = require('./activityLog.model');

// @desc    Log a new activity
// @route   POST /api/activityLog
// @access  Private (Parent)
exports.logActivity = async (req, res, next) => {
  try {
    const userId = req.user._id || req.user.id;
    const { babyId, type, startTime, endTime, details, amount, unit, notes } = req.body;

    let durationMinutes = null;
    if (startTime && endTime) {
      const start = new Date(startTime);
      const end = new Date(endTime);
      durationMinutes = Math.round((end - start) / 60000);
    }

    const log = await ActivityLog.create({
      babyId,
      userId,
      type,
      startTime,
      endTime,
      durationMinutes,
      details,
      amount,
      unit,
      notes
    });

    res.status(201).json({
      success: true,
      data: log
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get activity logs for a baby
// @route   GET /api/activityLog/baby/:babyId
// @access  Private (Parent/Doctor)
exports.getActivityLogs = async (req, res, next) => {
  try {
    const { babyId } = req.params;
    const { type, limit = 50 } = req.query;

    let query = { babyId };
    if (type) {
      query.type = type;
    }

    const logs = await ActivityLog.find(query).sort({ startTime: -1 }).limit(parseInt(limit));

    res.status(200).json({
      success: true,
      count: logs.length,
      data: logs
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update an activity log
// @route   PUT /api/activityLog/:id
// @access  Private (Parent/Doctor)
exports.updateActivityLog = async (req, res, next) => {
  try {
    let log = await ActivityLog.findById(req.params.id);

    if (!log) {
      return res.status(404).json({ success: false, message: 'Activity log not found' });
    }

    const { startTime, endTime } = req.body;
    let durationMinutes = log.durationMinutes;

    if (startTime || endTime) {
      const sTime = startTime || log.startTime;
      const eTime = endTime || log.endTime;
      if (sTime && eTime) {
        durationMinutes = Math.round((new Date(eTime) - new Date(sTime)) / 60000);
      }
    }

    const updatedData = { ...req.body, durationMinutes };

    log = await ActivityLog.findByIdAndUpdate(req.params.id, updatedData, {
      new: true,
      runValidators: true
    });

    res.status(200).json({
      success: true,
      data: log
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete an activity log
// @route   DELETE /api/activityLog/:id
// @access  Private (Parent/Admin)
exports.deleteActivityLog = async (req, res, next) => {
  try {
    const log = await ActivityLog.findById(req.params.id);

    if (!log) {
      return res.status(404).json({ success: false, message: 'Activity log not found' });
    }

    // Optional: check if log belongs to user
    await log.deleteOne();

    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (error) {
    next(error);
  }
};

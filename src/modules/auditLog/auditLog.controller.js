const auditLogService = require('./auditLog.service');

// @desc    Get all audit logs
// @route   GET /api/audit-logs
// @access  Private (Super Admin)
const getAuditLogs = async (req, res, next) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    const { logs, count } = await auditLogService.getAuditLogs(req.query);
    res.status(200).json({ success: true, count, data: logs });
  } catch (error) {
    next(error);
  }
};

// Internal utility function to create logs from other controllers
const createAuditLog = async (userId, action, resource, details = {}, ipAddress = '') => {
  await auditLogService.createAuditLog(userId, action, resource, details, ipAddress);
};

module.exports = {
  getAuditLogs,
  createAuditLog
};

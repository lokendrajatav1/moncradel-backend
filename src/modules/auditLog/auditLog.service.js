const AuditLog = require('./auditLog.model');

/**
 * Get all audit logs
 */
const getAuditLogs = async (filters = {}) => {
  const query = {};

  if (filters.search) {
    const User = require('../user/user.model');
    const matchedUsers = await User.find({
      name: { $regex: filters.search, $options: 'i' }
    }).select('_id');
    const userIds = matchedUsers.map(u => u._id);
    
    query.$or = [
      { action: { $regex: filters.search, $options: 'i' } },
      { resource: { $regex: filters.search, $options: 'i' } },
      { userId: { $in: userIds } }
    ];
  }

  const page = parseInt(filters.page, 10) || 1;
  const limit = parseInt(filters.limit, 10) || 10;
  const skip = (page - 1) * limit;

  const count = await AuditLog.countDocuments(query);
  const logs = await AuditLog.find(query)
    .populate('userId', 'name email role')
    .sort('-createdAt')
    .skip(skip)
    .limit(limit);

  return { logs, count };
};

/**
 * Internal utility function to create logs from other controllers/services
 */
const createAuditLog = async (userId, action, resource, details = {}, ipAddress = '') => {
  try {
    await AuditLog.create({
      userId,
      action,
      resource,
      details,
      ipAddress
    });
  } catch (error) {
    console.error('Error creating audit log:', error);
  }
};

module.exports = {
  getAuditLogs,
  createAuditLog
};

const mongoose = require('mongoose');

const auditLogSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  action: {
    type: String, // e.g., 'UPDATE_SETTING', 'DELETE_USER', 'CREATE_COUPON'
    required: true
  },
  resource: {
    type: String, // e.g., 'Setting', 'User', 'Coupon'
    required: true
  },
  details: {
    type: mongoose.Schema.Types.Mixed, // Storing old vs new values or just a description
    default: {}
  },
  ipAddress: {
    type: String,
    default: ''
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('AuditLog', auditLogSchema);

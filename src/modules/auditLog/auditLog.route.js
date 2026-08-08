const express = require('express');
const router = express.Router();
const { getAuditLogs } = require('./auditLog.controller');
const { protect } = require('../../middleware/auth');

router.route('/')
  .get(protect, getAuditLogs);

module.exports = router;

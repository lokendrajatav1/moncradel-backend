const express = require('express');
const router = express.Router();
const { getDashboardAnalytics } = require('./analytics.controller');
const { protect } = require('../../middleware/auth');
const validate = require('../../middleware/validate');
const { dashboardFilterSchema } = require('./analytics.validation');

router.route('/dashboard')
  .get(protect, validate(dashboardFilterSchema), getDashboardAnalytics);

module.exports = router;

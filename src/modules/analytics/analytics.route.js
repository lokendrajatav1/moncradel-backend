const express = require('express');
const router = express.Router();
const { getDashboardAnalytics, getDoctorAnalytics } = require('./analytics.controller');
const { protect } = require('../../middleware/auth');
const validate = require('../../middleware/validate');
const { dashboardFilterSchema } = require('./analytics.validation');

router.route('/dashboard')
  .get(protect, validate(dashboardFilterSchema), getDashboardAnalytics);

router.route('/doctor')
  .get(protect, getDoctorAnalytics);

module.exports = router;

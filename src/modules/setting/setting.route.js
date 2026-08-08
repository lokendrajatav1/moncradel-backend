const express = require('express');
const router = express.Router();
const { getSettings, updateSetting } = require('./setting.controller');
const { protect } = require('../../middleware/auth');
const validate = require('../../middleware/validate');
const { updateSettingSchema } = require('./setting.validation');

router.route('/')
  .get(getSettings)
  .post(protect, validate(updateSettingSchema), updateSetting); // Only admin can post, controller checks role

module.exports = router;

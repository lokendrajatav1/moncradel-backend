const express = require('express');
const router = express.Router();
const { addGrowthRecord, getGrowthRecords, updateGrowthRecord, deleteGrowthRecord } = require('./growth.controller');
const { protect } = require('../../middleware/auth');
const validate = require('../../middleware/validate');
const { growthSchema } = require('./growth.validation');

router.route('/')
  .post(protect, validate(growthSchema), addGrowthRecord);

router.route('/:babyId')
  .get(protect, getGrowthRecords);

router.route('/:id')
  .put(protect, validate(growthSchema), updateGrowthRecord)
  .delete(protect, deleteGrowthRecord);

module.exports = router;

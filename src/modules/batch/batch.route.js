const express = require('express');
const router = express.Router();
const { createBatch, updateBatchStatus, getBatches, deleteBatch } = require('./batch.controller');
const { protect } = require('../../middleware/auth');
const validate = require('../../middleware/validate');
const { batchSchema, statusSchema } = require('./batch.validation');

router.route('/')
  .post(protect, validate(batchSchema), createBatch)
  .get(protect, getBatches);

router.route('/:id/status')
  .patch(protect, validate(statusSchema), updateBatchStatus);

router.route('/:id')
  .delete(protect, deleteBatch);

module.exports = router;

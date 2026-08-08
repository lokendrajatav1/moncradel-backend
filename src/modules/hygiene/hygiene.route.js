const express = require('express');
const router = express.Router();
const { logHygieneTask, getHygieneLogs, updateHygieneTask, deleteHygieneTask } = require('./hygiene.controller');
const { protect } = require('../../middleware/auth');
const upload = require('../../middleware/upload');
const validate = require('../../middleware/validate');
const { logHygieneSchema } = require('./hygiene.validation');

router.route('/')
  .post(protect, upload.single('photo'), validate(logHygieneSchema), logHygieneTask)
  .get(protect, getHygieneLogs);

router.route('/:id')
  .put(protect, upload.single('photo'), updateHygieneTask)
  .delete(protect, deleteHygieneTask);

module.exports = router;

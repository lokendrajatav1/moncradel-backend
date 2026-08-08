const express = require('express');
const router = express.Router();
const { getEarnings, markAsPaid, createEarning, deleteEarning, updateEarning } = require('./earning.controller');
const { protect } = require('../../middleware/auth');

router.route('/')
  .get(protect, getEarnings)
  .post(protect, createEarning);

router.route('/:id')
  .put(protect, updateEarning)
  .delete(protect, deleteEarning);

router.route('/:id/pay')
  .patch(protect, markAsPaid);

module.exports = router;

const express = require('express');
const router = express.Router();
const { requestWithdrawal, getDoctorWithdrawals } = require('./withdrawal.controller');
const { protect } = require('../../middleware/auth');

router.route('/')
  .post(protect, requestWithdrawal)
  .get(protect, getDoctorWithdrawals);

module.exports = router;

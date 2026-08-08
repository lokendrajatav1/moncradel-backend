const express = require('express');
const router = express.Router();
const { getWallet, createTransaction } = require('./wallet.controller');
const { protect } = require('../../middleware/auth');
const validate = require('../../middleware/validate');
const { transactionSchema } = require('./wallet.validation');

router.route('/')
  .get(protect, getWallet);

router.route('/transaction')
  .post(protect, validate(transactionSchema), createTransaction);

module.exports = router;

const express = require('express');
const router = express.Router();
const { addAddress, getAddresses, updateAddress, deleteAddress } = require('./address.controller');
const { protect } = require('../../middleware/auth');
const validate = require('../../middleware/validate');
const { addressSchema } = require('./address.validation');

router.route('/')
  .post(protect, validate(addressSchema), addAddress)
  .get(protect, getAddresses);

router.route('/:id')
  .put(protect, validate(addressSchema), updateAddress)
  .delete(protect, deleteAddress);

module.exports = router;

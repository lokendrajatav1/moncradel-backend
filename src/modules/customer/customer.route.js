const express = require('express');
const router = express.Router();
const { getCustomers, getCustomer, updateCustomer, deleteCustomer } = require('./customer.controller');
const { protect, authorize } = require('../../middleware/auth');
const validate = require('../../middleware/validate');
const { updateCustomerSchema } = require('./customer.validation');

// All customer routes are protected and restricted to admin
router.use(protect);
router.use(authorize('admin'));

router.route('/')
  .get(getCustomers);

router.route('/:id')
  .get(getCustomer)
  .put(validate(updateCustomerSchema), updateCustomer)
  .delete(deleteCustomer);

module.exports = router;

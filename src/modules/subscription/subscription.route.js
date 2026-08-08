const express = require('express');
const router = express.Router();
const { createSubscription, getSubscriptions, updateSubscription, deleteSubscription } = require('./subscription.controller');
const { protect } = require('../../middleware/auth');
const validate = require('../../middleware/validate');
const { createSubscriptionSchema } = require('./subscription.validation');

router.route('/')
  .post(protect, validate(createSubscriptionSchema), createSubscription)
  .get(protect, getSubscriptions);

router.route('/:id')
  .patch(protect, updateSubscription)
  .delete(protect, deleteSubscription);

module.exports = router;

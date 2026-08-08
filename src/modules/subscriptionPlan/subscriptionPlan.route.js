const express = require('express');
const router = express.Router();
const {
  createSubscriptionPlan,
  getSubscriptionPlans,
  getSubscriptionPlanById,
  updateSubscriptionPlan,
  deleteSubscriptionPlan
} = require('./subscriptionPlan.controller');
const { protect } = require('../../middleware/auth');
const validate = require('../../middleware/validate');
const { createSubscriptionPlanSchema, updateSubscriptionPlanSchema } = require('./subscriptionPlan.validation');

// Let's keep getSubscriptionPlans protected so admin can see inactive plans,
// if public needs active plans later, a separate route can be added.
router.route('/')
  .get(protect, getSubscriptionPlans)
  .post(protect, validate(createSubscriptionPlanSchema), createSubscriptionPlan);

router.route('/:id')
  .get(getSubscriptionPlanById)
  .patch(protect, validate(updateSubscriptionPlanSchema), updateSubscriptionPlan)
  .delete(protect, deleteSubscriptionPlan);

module.exports = router;

const subscriptionPlanService = require('./subscriptionPlan.service');

const createSubscriptionPlan = async (req, res, next) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized to create subscription plans' });
    }
    const plan = await subscriptionPlanService.createSubscriptionPlan(req.body);
    res.status(201).json({ success: true, data: plan });
  } catch (error) {
    next(error);
  }
};

const getSubscriptionPlans = async (req, res, next) => {
  try {
    const role = req.user ? req.user.role : 'user'; // If no user (public endpoint maybe later), default to user filter
    const plans = await subscriptionPlanService.getSubscriptionPlans(role);
    res.status(200).json({ success: true, count: plans.length, data: plans });
  } catch (error) {
    next(error);
  }
};

const getSubscriptionPlanById = async (req, res, next) => {
  try {
    const plan = await subscriptionPlanService.getSubscriptionPlanById(req.params.id);
    res.status(200).json({ success: true, data: plan });
  } catch (error) {
    if (error.message === 'Subscription plan not found') {
      return res.status(404).json({ success: false, message: error.message });
    }
    next(error);
  }
};

const updateSubscriptionPlan = async (req, res, next) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized to update subscription plans' });
    }
    const plan = await subscriptionPlanService.updateSubscriptionPlan(req.params.id, req.body);
    res.status(200).json({ success: true, data: plan });
  } catch (error) {
    if (error.message === 'Subscription plan not found') {
      return res.status(404).json({ success: false, message: error.message });
    }
    next(error);
  }
};

const deleteSubscriptionPlan = async (req, res, next) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized to delete subscription plans' });
    }
    await subscriptionPlanService.deleteSubscriptionPlan(req.params.id);
    res.status(200).json({ success: true, message: 'Subscription plan deleted successfully' });
  } catch (error) {
    if (error.message === 'Subscription plan not found') {
      return res.status(404).json({ success: false, message: error.message });
    }
    next(error);
  }
};

module.exports = {
  createSubscriptionPlan,
  getSubscriptionPlans,
  getSubscriptionPlanById,
  updateSubscriptionPlan,
  deleteSubscriptionPlan
};

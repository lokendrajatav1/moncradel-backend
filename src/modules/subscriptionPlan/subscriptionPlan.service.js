const SubscriptionPlan = require('./subscriptionPlan.model');

const createSubscriptionPlan = async (data) => {
  return await SubscriptionPlan.create(data);
};

const getSubscriptionPlans = async (role) => {
  const filter = role === 'admin' ? {} : { isActive: true };
  return await SubscriptionPlan.find(filter).sort({ price: 1 });
};

const getSubscriptionPlanById = async (id) => {
  const plan = await SubscriptionPlan.findById(id);
  if (!plan) throw new Error('Subscription plan not found');
  return plan;
};

const updateSubscriptionPlan = async (id, data) => {
  const plan = await SubscriptionPlan.findByIdAndUpdate(id, data, { new: true, runValidators: true });
  if (!plan) throw new Error('Subscription plan not found');
  return plan;
};

const deleteSubscriptionPlan = async (id) => {
  const plan = await SubscriptionPlan.findByIdAndDelete(id);
  if (!plan) throw new Error('Subscription plan not found');
  return true;
};

module.exports = {
  createSubscriptionPlan,
  getSubscriptionPlans,
  getSubscriptionPlanById,
  updateSubscriptionPlan,
  deleteSubscriptionPlan
};

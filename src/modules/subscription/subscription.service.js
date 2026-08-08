const Subscription = require('./subscription.model');

/**
 * Create a new subscription
 */
const createSubscription = async (subscriptionData, parentId) => {
  const { babyId, planId, durationInDays } = subscriptionData;
  
  const endDate = new Date();
  endDate.setDate(endDate.getDate() + durationInDays);

  const subscription = await Subscription.create({
    parentId,
    babyId,
    planId,
    endDate
  });

  return subscription;
};

/**
 * Get all subscriptions based on role
 */
const getSubscriptions = async (role, userId, queryParentId) => {
  let filter = role === 'admin' ? {} : { parentId: userId };
  if (role === 'admin' && queryParentId) {
    filter.parentId = queryParentId;
  }
  return await Subscription.find(filter)
    .populate('parentId', 'name')
    .populate('babyId', 'name')
    .populate('planId', 'title price durationInDays');
};

/**
 * Update a subscription
 */
const updateSubscription = async (id, updateData) => {
  const subscription = await Subscription.findByIdAndUpdate(
    id,
    updateData,
    { new: true, runValidators: true }
  ).populate('parentId', 'name').populate('babyId', 'name').populate('planId', 'title price durationInDays');
  
  if (!subscription) throw new Error('Subscription not found');
  return subscription;
};

/**
 * Delete a subscription
 */
const deleteSubscription = async (id) => {
  const subscription = await Subscription.findByIdAndDelete(id);
  if (!subscription) throw new Error('Subscription not found');
  return true;
};

module.exports = {
  createSubscription,
  getSubscriptions,
  updateSubscription,
  deleteSubscription
};

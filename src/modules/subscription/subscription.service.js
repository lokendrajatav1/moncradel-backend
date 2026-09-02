const Subscription = require('./subscription.model');

/**
 * Create a new subscription
 */
const createSubscription = async (subscriptionData, parentId) => {
  const { babyId, planId, durationInDays, deliverySchedule, deliveryAddressId, totalAmount, endDate: providedEndDate } = subscriptionData;
  
  let endDate;
  if (planId && durationInDays) {
    // Fixed plan logic
    endDate = new Date();
    endDate.setDate(endDate.getDate() + durationInDays);
  } else if (deliverySchedule && deliverySchedule.length > 0) {
    // Custom meal plan logic
    const sortedDates = deliverySchedule.map(s => new Date(s.date)).sort((a, b) => b - a);
    endDate = sortedDates[0]; // the latest date
  } else {
    // fallback
    endDate = providedEndDate || new Date();
  }

  const subscription = await Subscription.create({
    parentId,
    babyId,
    planId,
    endDate,
    totalAmount,
    deliveryAddressId,
    deliverySchedule
  });

  return subscription;
};

/**
 * Skip a scheduled meal and carry it forward
 */
const skipMeal = async (subscriptionId, scheduleId, user = null) => {
  const subscription = await Subscription.findById(subscriptionId);
  if (!subscription) throw new Error('Subscription not found');

  if (user && user.role === 'parent' && subscription.parentId.toString() !== user._id.toString()) {
    throw new Error('Not authorized to skip this meal');
  }

  const scheduleItem = subscription.deliverySchedule.id(scheduleId);
  if (!scheduleItem) throw new Error('Schedule item not found');

  if (scheduleItem.status !== 'pending') {
    throw new Error('Can only skip pending meals');
  }

  // Check cut-off time (e.g. meal date must be in the future)
  // To avoid timezone issues, checking if it's strictly > current time
  if (new Date(scheduleItem.date) <= new Date()) {
    throw new Error('Too late to skip this meal');
  }

  scheduleItem.status = 'skipped';

  // Check if we already created a carry-forward day for this specific original date
  const existingCarryForward = subscription.deliverySchedule.find(
    item => item.carriedForwardFrom && item.carriedForwardFrom.getTime() === scheduleItem.date.getTime()
  );

  let targetDate;
  if (existingCarryForward) {
    // If we already extended the subscription for this day, group the meal onto that same day
    targetDate = new Date(existingCarryForward.date);
  } else {
    // Otherwise, create a new day at the end of the subscription
    let currentEndDate = new Date(subscription.endDate);
    currentEndDate.setDate(currentEndDate.getDate() + 1);
    subscription.endDate = currentEndDate;
    targetDate = currentEndDate;
  }

  // Add the skipped meal to the target date
  subscription.deliverySchedule.push({
    date: targetDate,
    carriedForwardFrom: scheduleItem.date,
    mealId: scheduleItem.mealId,
    productId: scheduleItem.productId,
    timeSlot: scheduleItem.timeSlot,
    specialInstructions: scheduleItem.specialInstructions,
    status: 'pending'
  });

  await subscription.save();

  // Populate necessary fields before returning
  await subscription.populate('parentId', 'name');
  await subscription.populate('babyId', 'name');
  await subscription.populate('planId', 'title price durationInDays');
  await subscription.populate('deliverySchedule.mealId', 'name description suitableForAgeGroup category ingredients nutritionalInfo tags allergens imageUrl images price discountedPrice');

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
    .populate('planId', 'title price durationInDays')
    .populate('deliverySchedule.mealId', 'name description suitableForAgeGroup category ingredients nutritionalInfo tags allergens imageUrl images price discountedPrice');
};

/**
 * Update a subscription
 */
const updateSubscription = async (id, updateData, user = null) => {
  if (user && user.role === 'parent') {
    const existing = await Subscription.findById(id);
    if (!existing) throw new Error('Subscription not found');
    if (existing.parentId.toString() !== user._id.toString()) {
      throw new Error('Not authorized to update this subscription');
    }
  }

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

/**
 * Update special instructions for a specific schedule item
 */
const updateInstructions = async (subscriptionId, scheduleId, instructions, user = null) => {
  const subscription = await Subscription.findById(subscriptionId);
  if (!subscription) throw new Error('Subscription not found');

  if (user && user.role === 'parent' && subscription.parentId.toString() !== user._id.toString()) {
    throw new Error('Not authorized to update this subscription');
  }

  const scheduleItem = subscription.deliverySchedule.id(scheduleId);
  if (!scheduleItem) throw new Error('Schedule item not found');

  scheduleItem.specialInstructions = instructions;
  await subscription.save();

  // Populate necessary fields before returning
  await subscription.populate('parentId', 'name');
  await subscription.populate('babyId', 'name');
  await subscription.populate('planId', 'title price durationInDays');
  await subscription.populate('deliverySchedule.mealId', 'name description suitableForAgeGroup category ingredients nutritionalInfo tags allergens imageUrl images price discountedPrice');

  return subscription;
};

module.exports = {
  createSubscription,
  getSubscriptions,
  updateSubscription,
  deleteSubscription,
  skipMeal,
  updateInstructions
};

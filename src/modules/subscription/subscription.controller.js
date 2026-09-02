const subscriptionService = require('./subscription.service');
const eventEmitter = require('../../events/eventEmitter');

// @desc    Create a subscription
// @route   POST /api/subscriptions
// @access  Private (Parent, Admin)
const createSubscription = async (req, res, next) => {
  try {
    if (req.user.role !== 'parent' && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized to create subscriptions' });
    }
    const parentId = req.user.role === 'admin' ? req.body.parentId : req.user._id;
    if (!parentId) {
      return res.status(400).json({ success: false, message: 'parentId is required when creating as admin' });
    }
    const subscription = await subscriptionService.createSubscription(req.body, parentId);
    res.status(201).json({ success: true, data: subscription });
  } catch (error) {
    next(error);
  }
};

// @desc    Get subscriptions
// @route   GET /api/subscriptions
// @access  Private
const getSubscriptions = async (req, res, next) => {
  try {
    const parentId = req.query.parentId;
    const subscriptions = await subscriptionService.getSubscriptions(req.user.role, req.user._id, parentId);
    res.status(200).json({ success: true, count: subscriptions.length, data: subscriptions });
  } catch (error) {
    next(error);
  }
};

// @desc    Update a subscription
// @route   PATCH /api/subscriptions/:id
// @access  Private (Admin)
const updateSubscription = async (req, res, next) => {
  try {
    if (req.user.role !== 'admin' && req.user.role !== 'parent') {
      return res.status(403).json({ success: false, message: 'Not authorized to update subscriptions' });
    }
    const subscription = await subscriptionService.updateSubscription(req.params.id, req.body, req.user);
    res.status(200).json({ success: true, data: subscription });
  } catch (error) {
    if (error.message === 'Subscription not found') {
      return res.status(404).json({ success: false, message: 'Subscription not found' });
    }
    next(error);
  }
};

// @desc    Delete a subscription
// @route   DELETE /api/subscriptions/:id
// @access  Private (Admin)
const deleteSubscription = async (req, res, next) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized to delete subscriptions' });
    }
    await subscriptionService.deleteSubscription(req.params.id);
    res.status(200).json({ success: true, message: 'Subscription deleted successfully' });
  } catch (error) {
    if (error.message === 'Subscription not found') {
      return res.status(404).json({ success: false, message: 'Subscription not found' });
    }
    next(error);
  }
};

// @desc    Skip a scheduled meal in a subscription
// @route   PATCH /api/subscriptions/:id/skip/:scheduleId
// @access  Private (Parent)
const skipMeal = async (req, res, next) => {
  try {
    const subscription = await subscriptionService.skipMeal(req.params.id, req.params.scheduleId, req.user);
    res.status(200).json({ success: true, data: subscription });
  } catch (error) {
    if (error.message.includes('not found')) {
      return res.status(404).json({ success: false, message: error.message });
    }
    if (error.message.includes('Too late') || error.message.includes('Can only skip')) {
      return res.status(400).json({ success: false, message: error.message });
    }
    next(error);
  }
};

// @desc    Update special instructions for a scheduled meal
// @route   PATCH /api/subscriptions/:id/instructions/:scheduleId
// @access  Private (Parent)
const updateInstructions = async (req, res, next) => {
  try {
    const { specialInstructions } = req.body;
    const subscription = await subscriptionService.updateInstructions(
      req.params.id,
      req.params.scheduleId,
      specialInstructions,
      req.user
    );
    res.status(200).json({ success: true, data: subscription });
  } catch (error) {
    if (error.message.includes('not found')) {
      return res.status(404).json({ success: false, message: error.message });
    }
    next(error);
  }
};

module.exports = {
  createSubscription,
  getSubscriptions,
  updateSubscription,
  deleteSubscription,
  skipMeal,
  updateInstructions
};

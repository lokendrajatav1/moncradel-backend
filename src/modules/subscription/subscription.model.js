const mongoose = require('mongoose');

const subscriptionSchema = new mongoose.Schema({
  parentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  babyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Baby',
    required: true
  },
  planId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'SubscriptionPlan',
    required: false // Optional for custom meal subscriptions
  },
  totalAmount: {
    type: Number,
    default: 0
  },
  deliveryAddressId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Address'
  },
  deliverySchedule: [{
    date: { type: Date, required: true },
    mealId: { type: mongoose.Schema.Types.ObjectId, ref: 'Meal' },
    productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
    timeSlot: { type: String, default: '' },
    specialInstructions: { type: String, default: '' },
    status: {
      type: String,
      enum: ['pending', 'skipped', 'ordered', 'delivered'],
      default: 'pending'
    },
    carriedForwardFrom: { type: Date },
    orderId: { type: mongoose.Schema.Types.ObjectId, ref: 'Order' }
  }],
  startDate: {
    type: Date,
    default: Date.now
  },
  endDate: {
    type: Date,
    required: true
  },
  status: {
    type: String,
    enum: ['active', 'expired', 'cancelled'],
    default: 'active'
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Subscription', subscriptionSchema);

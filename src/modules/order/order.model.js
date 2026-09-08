const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  parentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  babyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Baby'
  },
  mealSubscriptionId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'MealSubscription'
  },
  items: [{
    itemType: {
      type: String,
      enum: ['meal', 'product'],
      required: true
    },
    isSubscription: {
      type: Boolean,
      default: false
    },
    mealId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Meal'
    },
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product'
    },
    quantity: {
      type: Number,
      required: true,
      min: 1
    },
    priceAtAddition: {
      type: Number,
      required: true
    },
    timeSlot: {
      type: String,
      default: ''
    },
    specialInstructions: {
      type: String,
      default: ''
    },
    status: {
      type: String,
      enum: ['pending', 'preparing', 'ready', 'cancelled'],
      default: 'pending'
    }
  }],
  kitchenId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User' // Assigned when kitchen accepts
  },
  deliveryId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User' // Assigned when ready for delivery
  },
  status: {
    type: String,
    enum: ['pending', 'preparing', 'ready', 'out_for_delivery', 'delivered', 'cancelled'],
    default: 'pending'
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'paid', 'failed'],
    default: 'pending'
  },
  paymentMethod: {
    type: String,
    enum: ['upi', 'card', 'cod'],
    default: 'cod'
  },
  deliveryAddress: {
    title: String,
    name: String,
    flat: String,
    street: String,
    city: String,
    state: String,
    zipCode: String,
    phone: String
  },
  specialInstructions: {
    type: String,
    default: ''
  },
  distanceKm: {
    type: Number,
    default: function () {
      // Mock distance for now (between 1.0 and 8.0)
      return (Math.random() * 7 + 1).toFixed(1);
    }
  },
  proofOfDeliveryImageUrl: {
    type: String,
    default: ''
  },
  packagingProofImageUrl: {
    type: String,
    default: ''
  },
  totalAmount: {
    type: Number,
    required: true,
    default: 0
  },
  cancellationReason: {
    type: String,
    default: ''
  },
  cancelledBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  cancelledByRole: {
    type: String,
    enum: ['parent', 'kitchen', 'admin', 'delivery', 'system'],
    default: null
  },
  rejectedKitchens: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  rejectionHistory: [{
    kitchenId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    reason: String,
    rejectedAt: {
      type: Date,
      default: Date.now
    }
  }],
  couponCode: {
    type: String,
    default: ''
  },
  discountAmount: {
    type: Number,
    default: 0
  },
  isOtpRequired: {
    type: Boolean,
    default: false
  },
  deliveryOtp: {
    type: String
  },
  preparingAt: Date,
  readyAt: Date,
  outForDeliveryAt: Date,
  deliveredAt: Date,
  cancelledAt: Date
}, {
  timestamps: true
});

module.exports = mongoose.model('Order', orderSchema);

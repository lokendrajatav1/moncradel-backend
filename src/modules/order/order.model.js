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
  items: [{
    itemType: {
      type: String,
      enum: ['meal', 'product'],
      required: true
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
  deliveryAddress: {
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
    default: function() {
      // Mock distance for now (between 1.0 and 8.0)
      return (Math.random() * 7 + 1).toFixed(1);
    }
  },
  proofOfDeliveryImageUrl: {
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

const mongoose = require('mongoose');

const inventorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  category: {
    type: String,
    required: true,
    enum: ['Raw Material', 'Packaging', 'Other']
  },
  quantity: {
    type: Number,
    required: true,
    default: 0
  },
  unit: {
    type: String,
    required: true,
    default: 'kg'
  },
  minThreshold: {
    type: Number,
    required: true,
    default: 10
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for status based on quantity and threshold
inventorySchema.virtual('status').get(function() {
  if (this.quantity <= this.minThreshold / 2) {
    return 'Critical';
  } else if (this.quantity <= this.minThreshold) {
    return 'Low Stock';
  }
  return 'Optimal';
});

module.exports = mongoose.model('Inventory', inventorySchema);

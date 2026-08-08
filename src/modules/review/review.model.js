const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  parentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  mealId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Meal',
    required: true
  },
  orderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Order',
    required: true
  },
  rating: {
    type: Number,
    min: 1,
    max: 5,
    required: [true, 'Please add a rating between 1 and 5']
  },
  comment: {
    type: String,
    maxlength: 500
  }
}, {
  timestamps: true
});

// Prevent user from submitting more than one review per order
reviewSchema.index({ orderId: 1, parentId: 1 }, { unique: true });

module.exports = mongoose.model('Review', reviewSchema);

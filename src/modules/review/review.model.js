const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  parentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  // Type of review: 'meal' | 'doctor' | 'product' | 'deliveryPartner'
  targetType: {
    type: String,
    enum: ['meal', 'doctor', 'product', 'deliveryPartner'],
    required: true
  },
  // For meal reviews
  mealId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Meal'
  },
  orderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Order'
  },
  // For doctor reviews
  doctorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Doctor'
  },
  appointmentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Appointment'
  },
  // For product reviews
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product'
  },
  // For delivery partner reviews
  deliveryPartnerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'DeliveryPartner'
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

// One review per doctor appointment per parent
reviewSchema.index({ parentId: 1, appointmentId: 1 }, { unique: true, sparse: true });
// One delivery review per order per parent
reviewSchema.index({ parentId: 1, orderId: 1, targetType: 1, deliveryPartnerId: 1 }, { unique: true, sparse: true });
reviewSchema.index({ parentId: 1, orderId: 1, targetType: 1, mealId: 1 }, { unique: true, sparse: true });
reviewSchema.index({ parentId: 1, orderId: 1, targetType: 1, productId: 1 }, { unique: true, sparse: true });

module.exports = mongoose.model('Review', reviewSchema);

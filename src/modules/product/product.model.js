const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  category: {
    type: String, // e.g. 'diapers', 'formula', 'toys'
    required: true
  },
  stockQuantity: {
    type: Number,
    default: 0
  },
  imageUrl: {
    type: String,
    default: ''
  },
  images: [{
    type: String
  }],
  brand: {
    type: String,
    default: ''
  },
  discountedPrice: {
    type: Number,
    default: 0
  },
  sku: {
    type: String,
    default: ''
  },
  ageGroup: {
    type: String,
    default: ''
  },
  isFeatured: {
    type: Boolean,
    default: false
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Product', productSchema);

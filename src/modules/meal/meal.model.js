const mongoose = require('mongoose');

const mealSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add a meal name']
  },
  description: {
    type: String,
    required: [true, 'Please add a description']
  },
  suitableForAgeGroup: {
    type: String,
    enum: ['0-6 months', '6-12 months', '1-3 years', '3+ years'],
    required: true
  },
  category: {
    type: String,
    required: false
  },
  ingredients: {
    type: [String],
    required: true
  },
  nutritionalInfo: {
    calories: { type: Number },
    protein: { type: Number }, // in grams
    carbs: { type: Number },   // in grams
    fat: { type: Number }      // in grams
  },
  tags: {
    type: [String],
    default: []
  },
  allergens: {
    type: [String],
    default: []
  },
  imageUrl: {
    type: String,
    default: ''
  },
  images: [{
    type: String
  }],
  price: {
    type: Number,
    required: true,
    default: 0
  },
  discountedPrice: {
    type: Number,
    default: 0
  },
  isActive: {
    type: Boolean,
    default: true
  },
  inStock: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Meal', mealSchema);

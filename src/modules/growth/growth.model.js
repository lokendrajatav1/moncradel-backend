const mongoose = require('mongoose');

const growthSchema = new mongoose.Schema({
  babyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Baby',
    required: true
  },
  recordedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  weight: {
    type: Number, // in kg
    required: true
  },
  height: {
    type: Number, // in cm
    required: true
  },
  headCircumference: {
    type: Number // in cm
  },
  notes: {
    type: String,
    default: ''
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Growth', growthSchema);

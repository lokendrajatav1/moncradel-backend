const mongoose = require('mongoose');

const babySchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add the baby\'s name']
  },
  ageInMonths: {
    type: Number,
    required: [true, 'Please add the baby\'s age in months']
  },
  weightInKg: {
    type: Number,
    required: false
  },
  allergies: {
    type: [String],
    default: []
  },
  dietaryPreferences: {
    type: [String],
    default: []
  },
  parentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  assignedDoctorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Baby', babySchema);

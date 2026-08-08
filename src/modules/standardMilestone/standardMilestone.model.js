const mongoose = require('mongoose');

const standardMilestoneSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    default: '',
    trim: true
  },
  ageInMonths: {
    type: Number,
    required: true,
    min: 0
  },
  category: {
    type: String,
    enum: ['Physical', 'Cognitive', 'Social', 'Communication', 'Other'],
    default: 'Other'
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('StandardMilestone', standardMilestoneSchema);

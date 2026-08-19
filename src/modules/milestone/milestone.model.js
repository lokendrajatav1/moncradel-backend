const mongoose = require('mongoose');

const milestoneSchema = new mongoose.Schema({
  babyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Baby',
    required: true
  },
  title: {
    type: String, // e.g., 'First Step', 'First Word', 'First Tooth'
    required: true
  },
  dateAchieved: {
    type: String, // YYYY-MM-DD
    required: true
  },
  photoUrl: {
    type: String,
    default: ''
  },
  notes: {
    type: String,
    default: ''
  },
  category: {
    type: String,
    default: 'Other'
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Milestone', milestoneSchema);

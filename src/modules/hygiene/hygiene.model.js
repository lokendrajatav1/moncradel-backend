const mongoose = require('mongoose');

const hygieneSchema = new mongoose.Schema({
  kitchenId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // The kitchen staff who did the task
    required: true
  },
  taskName: {
    type: String,
    required: true
  },
  date: {
    type: String, // YYYY-MM-DD
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'completed'],
    default: 'pending'
  },
  photoUrl: {
    type: String,
    default: ''
  },
  completedBy: {
    type: String, // Name of the staff who completed it
    default: ''
  },
  completedById: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Hygiene', hygieneSchema);

const mongoose = require('mongoose');

const broadcastSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  message: {
    type: String,
    required: true
  },
  audience: {
    type: String,
    required: true,
    enum: ['All Users', 'Parents Only', 'Active Subscribers', 'Doctors Only', 'Kitchen Staff Only', 'Delivery Drivers Only']
  },
  sentCount: {
    type: Number,
    default: 0
  },
  status: {
    type: String,
    default: 'Delivered'
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Broadcast', broadcastSchema);

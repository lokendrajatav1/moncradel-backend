const mongoose = require('mongoose');

const staffSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: true
    },
    kitchenId: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: true
    },
    shift: {
      type: String,
      enum: ['Morning Shift', 'Evening Shift', 'Night Shift', 'Custom Time', 'Full Shift Lead', 'Afternoon Shift'],
      default: 'Morning Shift'
    },
    designation: {
      type: String
    },
    station: {
      type: String
    },
    joiningDate: {
      type: Date
    },
    status: {
      type: String,
      enum: ['On-Duty', 'On Break', 'Off-Duty', 'Terminated'],
      default: 'On-Duty'
    },
    healthCheckup: {
      type: String,
      default: 'Pending'
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('Staff', staffSchema);

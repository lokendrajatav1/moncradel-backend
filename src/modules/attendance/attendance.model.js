const mongoose = require('mongoose');

const AttendanceSchema = new mongoose.Schema({
  staffId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Staff',
    required: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  kitchenId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  date: {
    type: String,
    required: true,
    // Format: 'YYYY-MM-DD'
  },
  punchInTime: {
    type: Date,
    required: true,
    default: Date.now
  },
  punchOutTime: {
    type: Date
  },
  totalHoursWorked: {
    type: Number,
    default: 0
  },
  status: {
    type: String,
    enum: ['Present', 'Absent', 'Half-Day', 'Late'],
    default: 'Present'
  }
}, {
  timestamps: true
});

// Ensure a staff can only have one attendance record per day
AttendanceSchema.index({ staffId: 1, date: 1 }, { unique: true });

module.exports = mongoose.model('Attendance', AttendanceSchema);

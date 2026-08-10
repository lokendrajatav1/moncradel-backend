const mongoose = require('mongoose');

const doctorSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true
    },
    specialization: {
      type: String
    },
    experienceYears: {
      type: Number
    },
    clinicName: {
      type: String
    },
    clinicAddress: {
      type: String
    },
    registrationNumber: {
      type: String
    },
    degrees: {
      type: [String],
      default: []
    },
    consultationFee: {
      type: Number
    },
    isAvailable: {
      type: Boolean,
      default: true
    },
    qualifications: {
      type: [String],
      default: []
    },
    languagesSpoken: {
      type: [String],
      default: []
    },
    availability: [
      {
        dayOfWeek: { type: String, enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'] },
        shifts: [{
          startTime: { type: String }, // e.g. "09:00"
          endTime: { type: String }    // e.g. "17:00"
        }]
      }
    ],
    slotDuration: {
      type: Number,
      default: 30
    },
    bankDetails: {
      accountName: { type: String },
      accountNumber: { type: String },
      ifscCode: { type: String },
      bankName: { type: String }
    },
    rating: {
      type: Number,
      default: 0
    },
    verificationStatus: {
      type: String,
      enum: ['pending', 'approved', 'rejected'],
      default: 'pending'
    },
    about: {
      type: String
    },
    reviewsCount: {
      type: Number,
      default: 0
    },
    rejectionReason: {
      type: String,
      default: ''
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('Doctor', doctorSchema);

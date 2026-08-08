const mongoose = require('mongoose');

const otpSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
  },
  otp: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 600, // 600 seconds = 10 minutes (MongoDB TTL index)
  },
  expiresAt: {
    type: Date,
    required: true,
  }
});

// Create a compound index so an email can only have one active OTP (or we just update the existing one)
otpSchema.index({ email: 1 }, { unique: true });

module.exports = mongoose.model('OtpVerification', otpSchema);

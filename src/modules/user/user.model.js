const mongoose = require('mongoose');
const crypto = require('crypto');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String
    },
    email: {
      type: String,
      unique: true,
      sparse: true, // Allows multiple users to have no email without duplicate key errors
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        'Please add a valid email'
      ]
    },
    password: {
      type: String,
      required: [
        function() {
          // Password is required only for these professional roles (removed doctor to allow OTP login)
          return ['admin', 'kitchen'].includes(this.role);
        },
        'Please add a password for this role'
      ],
      minlength: 6,
      select: false // Don't return password by default
    },
    role: {
      type: String,
      enum: ['admin', 'delivery', 'doctor', 'kitchen', 'parent'],
      default: 'parent'
    },
    // Optional fields that might be specific to certain roles, but useful globally
    phone: {
      type: String,
      required: [true, 'Please add a phone number'],
      unique: true
    },
    address: {
      type: String
    },
    isActive: {
      type: Boolean,
      default: true
    },
    otp: {
      type: String,
      select: false
    },
    otpExpires: {
      type: Date,
      select: false
    },
    lastOtpSentAt: {
      type: Date,
      select: false
    },
    resetPasswordToken: String,
    resetPasswordExpire: Date,
    avatar: {
      type: String
    }
  },
  {
    timestamps: true
  }
);

// Generate and hash password token
userSchema.methods.getResetPasswordToken = function() {
  // Generate token
  const resetToken = crypto.randomBytes(20).toString('hex');

  // Hash token and set to resetPasswordToken field
  this.resetPasswordToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');

  // Set expire (10 minutes)
  this.resetPasswordExpire = Date.now() + 10 * 60 * 1000;

  return resetToken;
};

module.exports = mongoose.model('User', userSchema);

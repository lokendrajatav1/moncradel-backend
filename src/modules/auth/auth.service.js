const User = require('../user/user.model');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');

/**
 * Generate a JWT token
 */
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || '30d',
  });
};

/**
 * Register a new user
 */
const createUser = async (userData) => {
  const { name, email, password, role, phone } = userData;

  // Check if user exists by email
  const userExists = await User.findOne({ email });
  if (userExists) {
    throw new Error('User with this email already exists');
  }

  // Check if user exists by phone
  const phoneExists = await User.findOne({ phone });
  if (phoneExists) {
    throw new Error('User with this phone number already exists');
  }

  // Hash password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  // Create user
  const user = await User.create({
    name,
    email,
    password: hashedPassword,
    role,
    phone
  });

  return {
    _id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    token: generateToken(user._id)
  };
};

/**
 * Authenticate a user
 */
const authenticateUser = async (email, password) => {
  // Check for user email
  const user = await User.findOne({ email }).select('+password');
  console.log('User found in auth service:', user ? user.email : 'No user found with this email');

  if (!user) {
    throw new Error('Invalid credentials');
  }

  const isMatch = await bcrypt.compare(password, user.password);
  console.log('Password match:', isMatch);
  
  if (!isMatch) {
    throw new Error('Invalid credentials');
  }

  return {
    _id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    token: generateToken(user._id)
  };
};

/**
 * Send OTP (Find or Create User)
 */
const sendOtp = async (phone, additionalData = {}) => {
  let user = await User.findOne({ phone });

  if (!user) {
    // New user signup via OTP requires name and email initially to not break DB schema
    if (!additionalData.name || !additionalData.email) {
      throw new Error('New registration requires name and email along with phone number');
    }

    // Check if email already exists to prevent duplicate key error
    const emailExists = await User.findOne({ email: additionalData.email });
    if (emailExists) {
      throw new Error('User with this email already exists');
    }

    user = await User.create({
      name: additionalData.name,
      email: additionalData.email,
      phone: phone,
      role: additionalData.role || 'parent'
    });
  } else {
    // RATE LIMITING CHECK
    if (user.lastOtpSentAt) {
      const timeSinceLastOtp = Date.now() - user.lastOtpSentAt.getTime();
      const waitTime = 60000; // 60 seconds in milliseconds
      
      if (timeSinceLastOtp < waitTime) {
        const secondsLeft = Math.ceil((waitTime - timeSinceLastOtp) / 1000);
        throw new Error(`Please wait ${secondsLeft} seconds before requesting another OTP`);
      }
    }
  }

  // Generate 4 digit OTP
  const otp = Math.floor(1000 + Math.random() * 9000).toString();
  
  // Set expiration to 10 minutes from now
  const otpExpires = new Date(Date.now() + 10 * 60 * 1000);

  // Update user with OTP and current timestamp for rate limiting
  await User.findByIdAndUpdate(user._id, { 
    otp, 
    otpExpires,
    lastOtpSentAt: new Date()
  });

  // In a real app, send this via SMS (Twilio/Firebase)
  console.log(`[SMS MOCK] OTP for ${phone} is: ${otp}`);

  return { 
    message: 'OTP sent successfully',
    otp: otp // Added for testing purposes so you don't have to check logs
  };
};

/**
 * Verify OTP
 */
const verifyOtp = async (phone, otpCode) => {
  // Select OTP fields specifically because they are select: false in schema
  const user = await User.findOne({ phone }).select('+otp +otpExpires');

  if (!user) {
    throw new Error('User not found');
  }

  if (user.otp !== otpCode) {
    throw new Error('Invalid OTP');
  }

  if (user.otpExpires < new Date()) {
    throw new Error('OTP has expired');
  }

  // Clear OTP fields after successful verification
  await User.findByIdAndUpdate(user._id, { $unset: { otp: 1, otpExpires: 1 } });

  return {
    _id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    token: generateToken(user._id)
  };
};

/**
 * Forgot Password - Send OTP and Email Link (Hybrid)
 */
const forgotPassword = async (email) => {
  const user = await User.findOne({ email });
  if (!user) {
    throw new Error('User not found');
  }

  // 1. Generate 4 digit OTP for app verification
  const otp = Math.floor(1000 + Math.random() * 9000).toString();
  
  // 2. Generate secure token for web link verification
  const resetToken = user.getResetPasswordToken();

  // Save both to user document (getResetPasswordToken sets resetPasswordExpire internally)
  user.otp = otp;
  user.otpExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 mins
  
  await user.save({ validateBeforeSave: false });

  // Create reset url
  const resetUrl = `http://localhost:3000/reset-password/${resetToken}`;

  // MOCK SEND EMAIL
  console.log(`\n[EMAIL MOCK to ${user.email}]`);
  console.log(`Subject: Password Reset Request`);
  console.log(`Message: You are receiving this because you requested a password reset.`);
  console.log(`Option 1 (App): Enter this OTP: ${otp}`);
  console.log(`Option 2 (Web): Click this link: ${resetUrl}\n`);

  return { 
    message: 'Email sent with OTP and Reset Link',
    otp: otp, // Added for testing
    resetToken: resetToken // Added for testing
  };
};

/**
 * Reset Password (handles both OTP and Token methods)
 */
const resetPassword = async ({ token, otp, email, password }) => {
  let user;

  if (token) {
    // Flow 1: Web Link Verification
    const resetPasswordToken = crypto
      .createHash('sha256')
      .update(token)
      .digest('hex');

    user = await User.findOne({
      resetPasswordToken,
      resetPasswordExpire: { $gt: Date.now() }
    });

    if (!user) {
      throw new Error('Invalid or expired token');
    }
  } else if (otp && email) {
    // Flow 2: App OTP Verification
    user = await User.findOne({ email, otp, otpExpires: { $gt: Date.now() } }).select('+otp +otpExpires');
    
    if (!user) {
      throw new Error('Invalid or expired OTP');
    }
  } else {
    throw new Error('Must provide either a reset token OR (email and otp)');
  }

  // Hash new password
  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(password, salt);

  // Clear all reset fields
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;
  user.otp = undefined;
  user.otpExpires = undefined;

  await user.save();

  return { message: 'Password reset successful' };
};

module.exports = {
  createUser,
  authenticateUser,
  generateToken,
  sendOtp,
  verifyOtp,
  forgotPassword,
  resetPassword
};

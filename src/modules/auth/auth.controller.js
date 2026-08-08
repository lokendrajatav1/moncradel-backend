const authService = require('./auth.service');

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
const registerUser = async (req, res) => {
  try {
    const userData = await authService.createUser(req.body);
    res.status(201).json({
      success: true,
      ...userData
    });
  } catch (error) {
    // Basic error handling mapping
    if (error.message.includes('already exists')) {
      return res.status(400).json({ success: false, message: error.message });
    }
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Authenticate a user
// @route   POST /api/auth/login
// @access  Public
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log('Login attempt:', { email, passwordLength: password?.length });
    const userData = await authService.authenticateUser(email, password);
    
    res.json({
      success: true,
      ...userData
    });
  } catch (error) {
    if (error.message === 'Invalid credentials') {
      return res.status(401).json({ success: false, message: error.message });
    }
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Send OTP to phone
// @route   POST /api/auth/send-otp
// @access  Public
const sendOtp = async (req, res) => {
  try {
    const { phone, ...additionalData } = req.body;
    const result = await authService.sendOtp(phone, additionalData);
    res.status(200).json({ success: true, message: result.message });
  } catch (error) {
    if (error.message.includes('Please wait')) {
      return res.status(429).json({ success: false, message: error.message });
    }
    if (error.message.includes('requires name and email') || error.message.includes('already exists')) {
      return res.status(400).json({ success: false, message: error.message });
    }
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Verify OTP and Login
// @route   POST /api/auth/verify-otp
// @access  Public
const verifyOtp = async (req, res) => {
  try {
    const { phone, otp } = req.body;
    const userData = await authService.verifyOtp(phone, otp);
    
    res.json({
      success: true,
      ...userData
    });
  } catch (error) {
    if (['Invalid OTP', 'OTP has expired', 'User not found'].includes(error.message)) {
      return res.status(400).json({ success: false, message: error.message });
    }
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Forgot Password (Hybrid - Sends OTP and Link)
// @route   POST /api/auth/forgot-password
// @access  Public
const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const result = await authService.forgotPassword(email);
    res.status(200).json({ success: true, message: result.message });
  } catch (error) {
    if (error.message === 'User not found') {
      return res.status(404).json({ success: false, message: error.message });
    }
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Reset Password (Hybrid - Accepts OTP or Token)
// @route   POST /api/auth/reset-password
// @access  Public
const resetPassword = async (req, res) => {
  try {
    const result = await authService.resetPassword(req.body);
    res.status(200).json({ success: true, message: result.message });
  } catch (error) {
    if (['Invalid or expired token', 'Invalid or expired OTP', 'Must provide either a reset token OR (email and otp)'].includes(error.message)) {
      return res.status(400).json({ success: false, message: error.message });
    }
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  registerUser,
  loginUser,
  sendOtp,
  verifyOtp,
  forgotPassword,
  resetPassword
};

const express = require('express');
const router = express.Router();
const { registerUser, loginUser, sendOtp, verifyOtp, forgotPassword, resetPassword } = require('./auth.controller');
const validate = require('../../middleware/validate');
const { registerSchema, loginSchema, sendOtpSchema, verifyOtpSchema, forgotPasswordSchema, resetPasswordSchema } = require('./auth.validation');

router.post('/register', validate(registerSchema), registerUser);
router.post('/login', validate(loginSchema), loginUser);
router.post('/send-otp', validate(sendOtpSchema), sendOtp);
router.post('/verify-otp', validate(verifyOtpSchema), verifyOtp);
router.post('/forgot-password', validate(forgotPasswordSchema), forgotPassword);
router.post('/reset-password', validate(resetPasswordSchema), resetPassword);

module.exports = router;

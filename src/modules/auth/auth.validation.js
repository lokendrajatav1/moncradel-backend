const { z } = require('zod');

const registerSchema = z.object({
  name: z.string().min(2, { message: 'Name must be at least 2 characters long' }),
  email: z.string().email({ message: 'Invalid email address' }),
  password: z.string().min(6, { message: 'Password must be at least 6 characters long' }),
  role: z.enum(['admin', 'delivery', 'doctor', 'kitchen', 'parent']).optional(),
  phone: z.string().regex(/^\d{10}$/, "Must be a 10-digit number"),
  otp: z.string().length(4, { message: 'OTP must be exactly 4 digits' }),
});

const loginSchema = z.object({
  email: z.string().email({ message: 'Invalid email address' }),
  password: z.string().min(1, { message: 'Password is required' }),
});

const sendRegisterOtpSchema = z.object({
  email: z.string().email({ message: 'Invalid email address' }),
});

const sendOtpSchema = z.object({
  phone: z.string().regex(/^\d{10}$/, "Must be a 10-digit number"),
  name: z.string().min(2).optional(),
  email: z.string().email().optional(),
  role: z.enum(['admin', 'delivery', 'doctor', 'kitchen', 'parent']).optional(),
});

const verifyOtpSchema = z.object({
  phone: z.string().regex(/^\d{10}$/, "Must be a 10-digit number"),
  otp: z.string().length(4, { message: 'OTP must be exactly 4 digits' })
});

const forgotPasswordSchema = z.object({
  email: z.string().email({ message: 'Invalid email address' }),
});

const resetPasswordSchema = z.object({
  password: z.string().min(6, { message: 'Password must be at least 6 characters long' }),
  confirmPassword: z.string().min(6, { message: 'Confirm password must be at least 6 characters long' }),
  token: z.string().optional(),
  otp: z.string().length(4, { message: 'OTP must be exactly 4 digits' }).optional(),
  email: z.string().email({ message: 'Invalid email address' }).optional()
}).refine(data => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"]
}).refine(data => data.token || (data.otp && data.email), {
  message: "Provide either a reset token OR (otp and email)",
  path: ["token"]
});

module.exports = {
  registerSchema,
  loginSchema,
  sendOtpSchema,
  verifyOtpSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
  sendRegisterOtpSchema
};

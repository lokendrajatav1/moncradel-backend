const { z } = require('zod');

const registerSchema = z.object({
  name: z.string().min(2, { message: 'Name must be at least 2 characters long' }),
  email: z.string().email({ message: 'Invalid email address' }),
  password: z.string().min(6, { message: 'Password must be at least 6 characters long' }),
  role: z.enum(['admin', 'delivery', 'doctor', 'kitchen', 'parent']).optional(),
  phone: z.string().regex(/^\d{10}$/, "Must be a 10-digit number").optional(),
});

const loginSchema = z.object({
  email: z.string().email({ message: 'Invalid email address' }),
  password: z.string().min(1, { message: 'Password is required' }),
});

const updateProfileSchema = z.object({
  name: z.string().min(2, { message: 'Name must be at least 2 characters long' }).optional(),
}).passthrough(); // passthrough allows role-specific fields like specialization, address, etc. to pass through

module.exports = {
  registerSchema,
  loginSchema,
  updateProfileSchema
};

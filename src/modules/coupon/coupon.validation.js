const { z } = require('zod');

const couponSchema = z.object({
  code: z.string({ required_error: 'Coupon code is required' }),
  discountPercentage: z.number({ required_error: 'Discount percentage is required' }).min(0).max(100),
  maxDiscountAmount: z.number({ required_error: 'Max discount amount is required' }).min(0),
  expiryDate: z.string({ required_error: 'Expiry date is required' }).regex(/^\d{4}-\d{2}-\d{2}$/, "Must be in YYYY-MM-DD format"),
  isActive: z.boolean().optional()
});

const updateSchema = z.object({
  code: z.string().optional(),
  discountPercentage: z.number().min(0).max(100).optional(),
  maxDiscountAmount: z.number().min(0).optional(),
  expiryDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Must be in YYYY-MM-DD format").optional(),
  isActive: z.boolean().optional()
});

const applySchema = z.object({
  code: z.string({ required_error: 'Coupon code is required' }),
  cartTotal: z.number({ required_error: 'Cart total is required' }).min(0)
});

module.exports = {
  couponSchema,
  updateSchema,
  applySchema
};

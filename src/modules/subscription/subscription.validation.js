const { z } = require('zod');

const createSubscriptionSchema = z.object({
  babyId: z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid ObjectId format"),
  planId: z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid ObjectId format").optional(),
  durationInDays: z.number().min(1, { message: 'Duration must be at least 1 day' }).optional(),
  parentId: z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid ObjectId format").optional(),
  totalAmount: z.number().optional(),
  deliveryAddressId: z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid ObjectId format").optional(),
  deliverySchedule: z.array(z.any()).optional(),
  endDate: z.string().optional()
});

module.exports = {
  createSubscriptionSchema
};

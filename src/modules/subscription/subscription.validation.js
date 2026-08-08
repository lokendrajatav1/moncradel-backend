const { z } = require('zod');

const createSubscriptionSchema = z.object({
  babyId: z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid ObjectId format"),
  planId: z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid ObjectId format"),
  durationInDays: z.number().min(7, { message: 'Duration must be at least 7 days' }),
  parentId: z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid ObjectId format").optional()
});

module.exports = {
  createSubscriptionSchema
};

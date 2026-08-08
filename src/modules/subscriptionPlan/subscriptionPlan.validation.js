const { z } = require('zod');

const createSubscriptionPlanSchema = z.object({
  title: z.string().min(1, { message: 'Title is required' }),
  description: z.string().optional(),
  price: z.number().min(0, { message: 'Price cannot be negative' }),
  durationInDays: z.number().min(1, { message: 'Duration must be at least 1 day' }),
  features: z.array(z.string()).optional(),
  isActive: z.boolean().optional()
});

const updateSubscriptionPlanSchema = z.object({
  title: z.string().min(1, { message: 'Title is required' }).optional(),
  description: z.string().optional(),
  price: z.number().min(0, { message: 'Price cannot be negative' }).optional(),
  durationInDays: z.number().min(1, { message: 'Duration must be at least 1 day' }).optional(),
  features: z.array(z.string()).optional(),
  isActive: z.boolean().optional()
});

module.exports = {
  createSubscriptionPlanSchema,
  updateSubscriptionPlanSchema
};

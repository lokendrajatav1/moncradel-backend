const { z } = require('zod');

const addSchema = z.object({
  itemType: z.enum(['meal', 'product']),
  itemId: z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid ObjectId format"),
  quantity: z.number().min(1, { message: 'Quantity must be at least 1' }),
  isSubscription: z.boolean().optional(),
  deliveryDates: z.array(z.string()).optional(),
  timeSlot: z.string().optional(),
  specialInstructions: z.string().optional()
});

module.exports = {
  addSchema
};

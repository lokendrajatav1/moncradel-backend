const { z } = require('zod');

const ticketSchema = z.object({
  issueType: z.enum(['delivery_issue', 'payment_issue', 'food_quality', 'other']),
  description: z.string().min(10, { message: 'Description must be at least 10 characters' }),
  orderId: z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid ObjectId format").optional()
});

module.exports = {
  ticketSchema
};

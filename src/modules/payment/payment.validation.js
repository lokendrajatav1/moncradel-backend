const { z } = require('zod');

const createPaymentSchema = z.object({
  amount: z.number().min(0, { message: 'Amount is required and must be positive' }),
  orderId: z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid ObjectId format").optional(),
  subscriptionId: z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid ObjectId format").optional()
});

const verifyPaymentSchema = z.object({
  status: z.enum(['success', 'failed']),
  transactionId: z.string().min(1, { message: 'Transaction ID is required' })
});

module.exports = {
  createPaymentSchema,
  verifyPaymentSchema
};

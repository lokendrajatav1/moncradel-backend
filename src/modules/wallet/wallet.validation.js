const { z } = require('zod');

const transactionSchema = z.object({
  userId: z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid ObjectId format"),
  type: z.enum(['credit', 'debit']),
  amount: z.number().min(1, { message: 'Amount must be at least 1' }),
  description: z.string().min(1, { message: 'Description is required' })
});

module.exports = {
  transactionSchema
};

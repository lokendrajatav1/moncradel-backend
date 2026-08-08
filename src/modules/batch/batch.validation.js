const { z } = require('zod');

const batchSchema = z.object({
  mealId: z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid ObjectId format"),
  quantity: z.number().min(1, { message: 'Quantity must be at least 1' })
});

const statusSchema = z.object({
  status: z.enum(['pending', 'preparing', 'ready', 'completed'])
});

module.exports = {
  batchSchema,
  statusSchema
};

const { z } = require('zod');

const logHygieneSchema = z.object({
  taskName: z.string().min(2, { message: 'Task name is required' }),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Must be in YYYY-MM-DD format").or(z.date()).optional(),
  status: z.enum(['pending', 'completed']).optional(),
  kitchenId: z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid ObjectId format").optional()
});

module.exports = {
  logHygieneSchema
};

const { z } = require('zod');

const addReviewSchema = z.object({
  mealId: z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid ObjectId format"),
  orderId: z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid ObjectId format"),
  rating: z.number().min(1).max(5, { message: 'Rating must be between 1 and 5' }),
  comment: z.string().optional()
});

module.exports = {
  addReviewSchema
};

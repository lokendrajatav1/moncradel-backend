const { z } = require('zod');

const createOrderSchema = z.object({
  babyId: z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid ObjectId format").optional(),
  mealId: z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid ObjectId format").optional(),
  productId: z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid ObjectId format").optional(),
  deliveryAddress: z.object({
    street: z.string(),
    city: z.string(),
    state: z.string(),
    zipCode: z.string()
  }).optional(),
  specialInstructions: z.string().optional()
});

module.exports = {
  createOrderSchema
};

const { z } = require('zod');

const createOrderSchema = z.object({
  babyId: z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid ObjectId format").optional(),
  items: z.array(z.object({
    itemType: z.enum(['meal', 'product']),
    mealId: z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid ObjectId format").optional(),
    productId: z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid ObjectId format").optional(),
    quantity: z.number().min(1),
    priceAtAddition: z.number().min(0)
  })).min(1, "Order must have at least one item"),
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

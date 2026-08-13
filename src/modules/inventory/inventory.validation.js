const { z } = require('zod');

const inventorySchema = z.object({
  name: z.string().min(1, { message: 'Item name is required' }),
  category: z.string().min(1, { message: 'Category is required' }),
  quantity: z.number().min(0, { message: 'Quantity cannot be negative' }),
  unit: z.string().min(1, { message: 'Unit is required' }),
  minThreshold: z.number().optional()
});

const updateInventorySchema = inventorySchema.partial();

module.exports = {
  inventorySchema,
  updateInventorySchema
};

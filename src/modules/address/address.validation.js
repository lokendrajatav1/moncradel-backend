const { z } = require('zod');

const addressSchema = z.object({
  userId: z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid ObjectId format").optional(),
  title: z.string().min(1, { message: 'Title is required' }),
  street: z.string().min(1, { message: 'Street is required' }),
  city: z.string().min(1, { message: 'City is required' }),
  state: z.string().min(1, { message: 'State is required' }),
  zipCode: z.string().regex(/^\d{6}$/, { message: 'Zip Code must be exactly 6 digits' }),
  phone: z.string().regex(/^\d{10}$/, { message: 'Phone must be exactly 10 digits' }),
  isDefault: z.boolean().optional()
});

module.exports = {
  addressSchema
};

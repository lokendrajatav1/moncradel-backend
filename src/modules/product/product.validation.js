const { z } = require('zod');

// Note: Values might come as strings from FormData (multer)
// So we use z.coerce or regex where appropriate, but standard zod is fine if parsed correctly
const addProductSchema = z.object({
  name: z.string().min(2, { message: 'Product name must be at least 2 characters' }),
  description: z.string().min(10, { message: 'Description must be at least 10 characters' }),
  price: z.coerce.number().min(0, "Must be a positive number"), // Accepting string or number due to form-data
  category: z.string().min(2, { message: 'Category is required' }),
  stockQuantity: z.coerce.number().min(0, "Must be a positive number"),
  isActive: z.any().optional().transform(val => val === 'false' || val === false ? false : true),
  brand: z.string().optional(),
  discountedPrice: z.coerce.number().min(0, "Must be a positive number").optional(),
  sku: z.string().optional(),
  ageGroup: z.string().optional(),
  imageOrder: z.any().optional(),
  isFeatured: z.any().optional().transform(val => val === 'true' || val === true),
});

const updateProductSchema = z.object({
  name: z.string().min(2).optional(),
  description: z.string().min(10).optional(),
  price: z.coerce.number().min(0, "Must be a positive number").optional(),
  category: z.string().min(2).optional(),
  stockQuantity: z.coerce.number().min(0, "Must be a positive number").optional(),
  imageUrl: z.string().optional(),
  existingImages: z.any().optional(),
  imageOrder: z.any().optional(),
  isActive: z.any().optional().transform(val => val === 'false' || val === false ? false : true),
  brand: z.string().optional(),
  discountedPrice: z.coerce.number().min(0, "Must be a positive number").optional(),
  sku: z.string().optional(),
  ageGroup: z.string().optional(),
  isFeatured: z.any().optional().transform(val => val === 'true' || val === true),
});

module.exports = {
  addProductSchema,
  updateProductSchema
};

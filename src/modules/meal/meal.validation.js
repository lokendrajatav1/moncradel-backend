const { z } = require('zod');

const addMealSchema = z.object({
  name: z.string().min(2, { message: 'Meal name is required' }),
  description: z.string().min(5, { message: 'Description is required' }),
  suitableForAgeGroup: z.enum(['0-6 months', '6-12 months', '1-3 years', '3+ years']),
  ingredients: z.array(z.string()).min(1, { message: 'At least one ingredient is required' }),
  price: z.number().min(0, { message: 'Price cannot be negative' }),
  nutritionalInfo: z.object({
    calories: z.number().optional(),
    protein: z.number().optional(),
    carbs: z.number().optional(),
    fat: z.number().optional()
  }).optional()
});

module.exports = {
  addMealSchema
};

const { z } = require('zod');

const standardMilestoneSchema = z.object({
  title: z.string({ required_error: 'Title is required' }).min(2, 'Title is too short'),
  description: z.string().optional(),
  ageInMonths: z.number({ required_error: 'Age in months is required' }).min(0, 'Age must be positive'),
  category: z.enum(['Physical', 'Cognitive', 'Social', 'Communication', 'Other']).optional()
});

const updateStandardMilestoneSchema = z.object({
  title: z.string().min(2, 'Title is too short').optional(),
  description: z.string().optional(),
  ageInMonths: z.number().min(0, 'Age must be positive').optional(),
  category: z.enum(['Physical', 'Cognitive', 'Social', 'Communication', 'Other']).optional()
});

module.exports = {
  standardMilestoneSchema,
  updateStandardMilestoneSchema
};

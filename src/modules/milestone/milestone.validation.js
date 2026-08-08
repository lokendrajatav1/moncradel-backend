const { z } = require('zod');

const addMilestoneSchema = z.object({
  babyId: z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid ObjectId format"),
  title: z.string().min(2, { message: 'Title is required' }),
  dateAchieved: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Must be in YYYY-MM-DD format").or(z.date()).optional(),
  notes: z.string().optional()
});

module.exports = {
  addMilestoneSchema
};

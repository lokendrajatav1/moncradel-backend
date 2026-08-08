const { z } = require('zod');

const scheduleItemSchema = z.object({
  day: z.enum(['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']),
  mealId: z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid ObjectId format")
});

const planSchema = z.object({
  babyId: z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid ObjectId format"),
  weeklySchedule: z.array(scheduleItemSchema).min(1, { message: 'At least one meal must be scheduled' }),
  guidelines: z.string().optional()
});

module.exports = {
  planSchema
};

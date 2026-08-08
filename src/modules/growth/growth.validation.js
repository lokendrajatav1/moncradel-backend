const { z } = require('zod');

const growthSchema = z.object({
  babyId: z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid ObjectId format"),
  weight: z.number().min(0.5, { message: 'Weight must be at least 0.5 kg' }),
  height: z.number().min(10, { message: 'Height must be at least 10 cm' }),
  headCircumference: z.number().optional(),
  notes: z.string().optional()
});

module.exports = {
  growthSchema
};

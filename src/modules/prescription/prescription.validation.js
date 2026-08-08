const { z } = require('zod');

// Using standard Zod here, assuming form-data is parsed or fields exist
const uploadPrescriptionSchema = z.object({
  babyId: z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid ObjectId format"),
  medicalNotes: z.string().optional(),
  nutritionRecommendations: z.string().optional(),
  medicines: z.string().optional(), // Expected to be JSON stringified
  vitals: z.string().optional(),    // Expected to be JSON stringified
  nextVisitDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Must be in YYYY-MM-DD format").optional()
});

module.exports = {
  uploadPrescriptionSchema
};

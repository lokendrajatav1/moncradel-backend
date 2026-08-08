const { z } = require('zod');

const addBabySchema = z.object({
  name: z.string().min(2, { message: 'Baby name must be at least 2 characters long' }),
  ageInMonths: z.number().min(0, { message: 'Age must be a positive number' }),
  weightInKg: z.number().optional(),
  allergies: z.array(z.string()).optional(),
  dietaryPreferences: z.array(z.string()).optional(),
  assignedDoctorId: z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid ObjectId format").optional() // MongoDB ObjectId string
});

module.exports = {
  addBabySchema
};

const { z } = require('zod');

const addBabySchema = z.object({
  name: z.string().min(2, { message: 'Baby name must be at least 2 characters long' }),
  gender: z.enum(['boy', 'girl', 'private'], { message: 'Gender must be boy, girl, or private' }),
  dateOfBirth: z.string().or(z.date()),
  ageInMonths: z.coerce.number().min(0).optional(),
  prematureDays: z.coerce.number().min(0).optional(),
  weight: z.coerce.number().min(0).optional(),
  height: z.coerce.number().min(0).optional(),
  medicalCondition: z.string().optional(),
  diet: z.string().optional(),
  bloodType: z.enum(['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']).optional(),
  allergies: z.preprocess((val) => {
    if (typeof val === 'string') {
      try {
        const parsed = JSON.parse(val);
        if (Array.isArray(parsed)) return parsed.map(String);
      } catch (e) {
        return val.trim() === "" ? [] : val.split(',').map(s => s.trim()).filter(Boolean);
      }
    }
    return val;
  }, z.array(z.string()).optional()),
  assignedDoctorId: z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid ObjectId format").optional(),
  parentId: z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid ObjectId format").optional()
});

const updateBabySchema = addBabySchema.partial();

module.exports = {
  addBabySchema,
  updateBabySchema
};

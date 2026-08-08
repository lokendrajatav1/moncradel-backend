const { z } = require('zod');

const growthSchema = z.object({
  babyId: z.string().min(1, { message: 'Baby ID is required' }),
  weight: z.number().min(0.5, { message: 'Weight must be at least 0.5 kg' }),
  height: z.number().min(10, { message: 'Height must be at least 10 cm' }),
  headCircumference: z.number().optional(),
  notes: z.string().optional()
});

try {
  growthSchema.parse({
    babyId: '6a703cbe04d6ed9f00414f11',
    weight: 12,
    height: 50,
    headCircumference: undefined,
    notes: ''
  });
  console.log("Success");
} catch(e) {
  console.log(e.errors);
}

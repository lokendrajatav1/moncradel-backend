const { z } = require('zod');

const logActivitySchema = z.object({
  babyId: z.string({ required_error: 'Baby ID is required' }),
  type: z.enum(['sleep', 'feeding', 'diaper', 'other'], { 
    required_error: 'Activity type is required',
    invalid_type_error: 'Invalid activity type'
  }),
  startTime: z.coerce.date({
    required_error: "Start time is required",
    invalid_type_error: "Start time must be a valid date",
  }),
  endTime: z.coerce.date({
    invalid_type_error: "End time must be a valid date",
  }).optional().nullable(),
  details: z.string().optional().nullable(),
  amount: z.coerce.number().min(0).optional().nullable(),
  unit: z.string().optional().nullable(),
  notes: z.string().optional().nullable()
});

const updateActivityLogSchema = logActivitySchema.partial();

module.exports = {
  logActivitySchema,
  updateActivityLogSchema
};

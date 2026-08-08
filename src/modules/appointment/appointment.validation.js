const { z } = require('zod');

const appointmentSchema = z.object({
  doctorId: z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid ObjectId format"),
  babyId: z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid ObjectId format"),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Must be in YYYY-MM-DD format"),
  time: z.string().regex(/^([0-1]\d|2[0-3]):([0-5]\d)$/, "Must be in HH:mm format"),
  notes: z.string().optional(),
  parentId: z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid ObjectId format").optional(),
  status: z.enum(['scheduled', 'completed', 'cancelled']).optional(),
  cancellationReason: z.string().optional(),
  doctorNotes: z.string().optional()
});

const appointmentStatusSchema = z.object({
  status: z.enum(['scheduled', 'completed', 'cancelled']),
  meetingLink: z.string().optional(),
  cancellationReason: z.string().optional(),
  doctorNotes: z.string().optional()
});

module.exports = {
  appointmentSchema,
  appointmentStatusSchema
};

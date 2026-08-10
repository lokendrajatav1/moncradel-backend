const { z } = require('zod');

const updateDoctorSchema = z.object({
  specialization: z.string().min(1, "Specialization is required"),
  experienceYears: z.number().min(0, "Must be a positive number"),
  clinicName: z.string().min(1, "Clinic Name is required"),
  clinicAddress: z.string().optional(),
  registrationNumber: z.string().min(1, "Registration Number is required"),
  degrees: z.array(z.string().trim()).optional(),
  consultationFee: z.number().min(0, "Must be a positive number"),
  isAvailable: z.boolean().optional(),
  qualifications: z.array(z.string()).optional(),
  languagesSpoken: z.array(z.string()).optional(),
  availability: z.array(z.object({
    dayOfWeek: z.enum(['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']),
    shifts: z.array(z.object({
      startTime: z.string().regex(/^([0-1]\d|2[0-3]):([0-5]\d)$/, "Must be in HH:mm format"),
      endTime: z.string().regex(/^([0-1]\d|2[0-3]):([0-5]\d)$/, "Must be in HH:mm format")
    }))
  })).optional(),
  slotDuration: z.number().min(5).max(120).optional(),
  bankDetails: z.object({
    accountName: z.string().min(1, "Account Name is required"),
    accountNumber: z.string().min(1, "Account Number is required"),
    ifscCode: z.string().regex(/^[A-Z]{4}0[A-Z0-9]{6}$/, "Invalid IFSC Code format"),
    bankName: z.string().min(1, "Bank Name is required")
  }).optional(),
  rating: z.number().optional(),
  about: z.string().optional(),
  reviewsCount: z.number().min(0).optional(),
  availableSlots: z.number().min(0).optional(),
  verificationStatus: z.enum(['pending', 'approved', 'rejected']).optional(),
  rejectionReason: z.string().optional()
});

module.exports = {
  updateDoctorSchema
};

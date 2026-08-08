const { z } = require('zod');

const updateDeliveryPartnerSchema = z.object({
  vehicleType: z.string().min(1, "Vehicle Type is required"),
  vehicleNumber: z.string().min(1, "Vehicle Number is required"),
  drivingLicenseNumber: z.string().min(10, "Driving License Number is required"),
  aadharNumber: z.string().regex(/^\d{12}$/, "Aadhar Number must be exactly 12 digits"),
  isOnline: z.boolean().optional(),
  isActive: z.boolean().optional(),
  insuranceExpiryDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Must be in YYYY-MM-DD format").optional(), // Using string for Date to allow ISO formats
  bankDetails: z.object({
    accountName: z.string().min(1, "Account Name is required"),
    accountNumber: z.string().min(1, "Account Number is required"),
    ifscCode: z.string().regex(/^[A-Z]{4}0[A-Z0-9]{6}$/, "Invalid IFSC Code format"),
    bankName: z.string().min(1, "Bank Name is required")
  }),
  emergencyContact: z.object({
    name: z.string().min(1, "Emergency Name is required"),
    relation: z.string().min(1, "Emergency Relation is required"),
    phone: z.string().regex(/^\d{10}$/, "Must be a 10-digit number")
  }),
  rating: z.number().optional()
});

module.exports = {
  updateDeliveryPartnerSchema
};

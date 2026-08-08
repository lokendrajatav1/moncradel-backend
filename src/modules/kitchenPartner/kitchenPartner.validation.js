const { z } = require('zod');

const updateKitchenPartnerSchema = z.object({
  kitchenName: z.string().min(1, "Kitchen Name is required"),
  fssaiLicenseNumber: z.string().regex(/^\d{14}$/, "FSSAI License must be 14 digits"),
  ownerName: z.string().min(1, "Owner Name is required"),
  address: z.string().optional(),
  preparationCapacityPerDay: z.number().min(1, "Capacity must be positive"),
  isOpen: z.boolean().optional(),
  gstNumber: z.string().regex(/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/, "Invalid GST Number format").optional(),
  bankDetails: z.object({
    accountName: z.string().min(1, "Account Name is required"),
    accountNumber: z.string().min(1, "Account Number is required"),
    ifscCode: z.string().regex(/^[A-Z]{4}0[A-Z0-9]{6}$/, "Invalid IFSC Code format"),
    bankName: z.string().min(1, "Bank Name is required")
  }),
  location: z.object({
    type: z.literal('Point').optional(),
    coordinates: z.array(z.number()).optional()
  }).optional(),
  operatingHours: z.object({
    openTime: z.string().regex(/^([0-1]\d|2[0-3]):([0-5]\d)$/, "Must be in HH:mm format").optional(),
    closeTime: z.string().regex(/^([0-1]\d|2[0-3]):([0-5]\d)$/, "Must be in HH:mm format").optional()
  }).optional(),
  rating: z.number().optional(),
  cuisineTypes: z.array(z.string()).optional()
});

module.exports = {
  updateKitchenPartnerSchema
};

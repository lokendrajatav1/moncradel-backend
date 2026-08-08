const { z } = require('zod');

const updateCustomerSchema = z.object({
  address: z.string().optional(),
  alternatePhone: z.string().regex(/^\d{10}$/, "Must be a 10-digit number").optional(),
  emergencyContact: z.string().regex(/^\d{10}$/, "Must be a 10-digit number").optional()
});

module.exports = {
  updateCustomerSchema
};

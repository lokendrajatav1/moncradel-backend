const { z } = require('zod');

const updateSettingSchema = z.object({
  key: z.string().min(1, { message: 'Key is required' }),
  value: z.any({ required_error: 'Value is required' }), // Settings can have various types of values
  description: z.string().optional()
});

module.exports = {
  updateSettingSchema
};

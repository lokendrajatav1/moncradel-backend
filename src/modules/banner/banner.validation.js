const { z } = require('zod');

const bannerSchema = z.object({
  title: z.string().min(1, { message: 'Title is required' }),
  link: z.string().url({ message: 'Must be a valid URL' }).optional(),
  isActive: z.boolean().or(z.string()).optional() // Can be passed as string 'true'/'false' in form-data
});

module.exports = {
  bannerSchema
};

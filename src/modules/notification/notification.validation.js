const { z } = require('zod');

const broadcastSchema = z.object({
  title: z.string({ required_error: 'Title is required' }),
  message: z.string({ required_error: 'Message is required' }),
  audience: z.enum(['All Users', 'Parents Only', 'Active Subscribers', 'Doctors Only', 'Kitchen Staff Only', 'Delivery Drivers Only'], {
    required_error: 'Audience is required',
    invalid_type_error: 'Invalid audience selected'
  })
});

module.exports = {
  broadcastSchema
};

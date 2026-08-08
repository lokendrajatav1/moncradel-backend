const { z } = require('zod');

const updateCustomerSchema = z.object({
  address: z.string().optional()
});

module.exports = {
  updateCustomerSchema
};

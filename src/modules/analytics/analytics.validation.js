const { z } = require('zod');

// Currently no input validation needed for standard dashboard analytics
// Created here for future extension (e.g., date ranges)
const dashboardFilterSchema = z.object({
  startDate: z.string().datetime().optional(),
  endDate: z.string().datetime().optional()
});

module.exports = {
  dashboardFilterSchema
};

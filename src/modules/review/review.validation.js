const { z } = require('zod');

const objectId = z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid ObjectId format');

const addReviewSchema = z.discriminatedUnion('targetType', [
  // Meal review — from a delivered order
  z.object({
    targetType: z.literal('meal'),
    mealId: objectId.optional(),
    orderId: objectId,
    rating: z.number().min(1).max(5),
    comment: z.string().max(500).optional()
  }),
  // Doctor review — from a completed appointment
  z.object({
    targetType: z.literal('doctor'),
    doctorId: objectId,
    appointmentId: objectId,
    rating: z.number().min(1).max(5),
    comment: z.string().max(500).optional()
  }),
  // Product review — from a delivered order
  z.object({
    targetType: z.literal('product'),
    productId: objectId,
    orderId: objectId,
    rating: z.number().min(1).max(5),
    comment: z.string().max(500).optional()
  }),
  // Delivery partner review — from a delivered order
  z.object({
    targetType: z.literal('deliveryPartner'),
    deliveryPartnerId: objectId.optional(),
    orderId: objectId,
    rating: z.number().min(1).max(5),
    comment: z.string().max(500).optional()
  })
]);

module.exports = { addReviewSchema };

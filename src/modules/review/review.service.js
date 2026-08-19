const Review = require('./review.model');
const Order = require('../order/order.model');
const Appointment = require('../appointment/appointment.model');

/**
 * Add a review — supports meal, doctor, product, deliveryPartner
 */
const addReview = async (parentId, reviewData) => {
  const { targetType, rating, comment } = reviewData;

  if (targetType === 'meal') {
    const { mealId, orderId } = reviewData;
    const order = await Order.findById(orderId);
    if (!order) throw new Error('Order not found');
    if (order.parentId.toString() !== parentId.toString()) throw new Error('Not authorized to review this order');
    if (order.status !== 'delivered') throw new Error('Can only review delivered orders');

    const existing = await Review.findOne({ parentId, orderId, targetType: 'meal' });
    if (existing) throw Object.assign(new Error('Already reviewed'), { code: 11000 });

    return await Review.create({ parentId, targetType, mealId, orderId, rating, comment });
  }

  if (targetType === 'product') {
    const { productId, orderId } = reviewData;
    const order = await Order.findById(orderId);
    if (!order) throw new Error('Order not found');
    if (order.parentId.toString() !== parentId.toString()) throw new Error('Not authorized to review this order');
    if (order.status !== 'delivered') throw new Error('Can only review delivered orders');

    const existing = await Review.findOne({ parentId, orderId, targetType: 'product' });
    if (existing) throw Object.assign(new Error('Already reviewed'), { code: 11000 });

    return await Review.create({ parentId, targetType, productId, orderId, rating, comment });
  }

  if (targetType === 'doctor') {
    const { doctorId, appointmentId } = reviewData;
    const appointment = await Appointment.findById(appointmentId);
    if (!appointment) throw new Error('Appointment not found');
    if (appointment.parentId.toString() !== parentId.toString()) throw new Error('Not authorized to review this appointment');
    if (appointment.status !== 'completed') throw new Error('Can only review completed appointments');

    const existing = await Review.findOne({ parentId, appointmentId });
    if (existing) throw Object.assign(new Error('Already reviewed'), { code: 11000 });

    return await Review.create({ parentId, targetType, doctorId, appointmentId, rating, comment });
  }

  if (targetType === 'deliveryPartner') {
    const { deliveryPartnerId, orderId } = reviewData;
    const order = await Order.findById(orderId);
    if (!order) throw new Error('Order not found');
    if (order.parentId.toString() !== parentId.toString()) throw new Error('Not authorized to review this order');
    if (order.status !== 'delivered') throw new Error('Can only review delivered orders');

    const existing = await Review.findOne({ parentId, orderId, targetType: 'deliveryPartner' });
    if (existing) throw Object.assign(new Error('Already reviewed'), { code: 11000 });

    return await Review.create({ parentId, targetType, deliveryPartnerId, orderId, rating, comment });
  }

  throw new Error('Invalid targetType');
};

/**
 * Get reviews for a specific meal
 */
const getMealReviews = async (mealId) => {
  return await Review.find({ mealId, targetType: 'meal' })
    .populate('parentId', 'name')
    .sort('-createdAt');
};

/**
 * Get reviews for a specific doctor
 */
const getDoctorReviews = async (doctorId) => {
  return await Review.find({ doctorId, targetType: 'doctor' })
    .populate('parentId', 'name')
    .sort('-createdAt');
};

/**
 * Get reviews for a specific product
 */
const getProductReviews = async (productId) => {
  return await Review.find({ productId, targetType: 'product' })
    .populate('parentId', 'name')
    .sort('-createdAt');
};

/**
 * Get reviews for a specific delivery partner
 */
const getDeliveryPartnerReviews = async (deliveryPartnerId) => {
  return await Review.find({ deliveryPartnerId, targetType: 'deliveryPartner' })
    .populate('parentId', 'name')
    .sort('-createdAt');
};

/**
 * Check if parent already reviewed a target (to prevent duplicates on frontend)
 */
const hasReviewed = async (parentId, query) => {
  const review = await Review.findOne({ parentId, ...query });
  return !!review;
};

/**
 * Get all reviews (for Admin) with pagination, search, and filtering
 */
const getAllReviews = async (query = {}) => {
  const page = parseInt(query.page, 10) || 1;
  const limit = parseInt(query.limit, 10) || 10;
  const skip = (page - 1) * limit;

  const matchQuery = {};
  if (query.targetType) matchQuery.targetType = query.targetType;
  if (query.rating && query.rating !== 'All Ratings') {
    if (query.rating === '1-3 Stars (Low)') {
      matchQuery.rating = { $lte: 3 };
    } else if (query.rating === '5 Stars') {
      matchQuery.rating = 5;
    } else if (query.rating === '4 Stars') {
      matchQuery.rating = 4;
    } else {
      matchQuery.rating = parseInt(query.rating, 10);
    }
  }

  let pipeline = [
    { $match: matchQuery },
    {
      $lookup: {
        from: 'users',
        localField: 'parentId',
        foreignField: '_id',
        as: 'parentId'
      }
    },
    { $unwind: { path: '$parentId', preserveNullAndEmptyArrays: true } },
    {
      $lookup: {
        from: 'meals',
        localField: 'mealId',
        foreignField: '_id',
        as: 'mealId'
      }
    },
    { $unwind: { path: '$mealId', preserveNullAndEmptyArrays: true } },
    {
      $lookup: {
        from: 'products',
        localField: 'productId',
        foreignField: '_id',
        as: 'productId'
      }
    },
    { $unwind: { path: '$productId', preserveNullAndEmptyArrays: true } },
    {
      $lookup: {
        from: 'doctors',
        localField: 'doctorId',
        foreignField: '_id',
        as: 'doctorId'
      }
    },
    { $unwind: { path: '$doctorId', preserveNullAndEmptyArrays: true } },
    {
      $lookup: {
        from: 'deliverypartners',
        localField: 'deliveryPartnerId',
        foreignField: '_id',
        as: 'deliveryPartnerId'
      }
    },
    { $unwind: { path: '$deliveryPartnerId', preserveNullAndEmptyArrays: true } }
  ];

  if (query.search) {
    const searchRegex = new RegExp(query.search, 'i');
    pipeline.push({
      $match: {
        $or: [
          { comment: { $regex: searchRegex } },
          { 'parentId.name': { $regex: searchRegex } },
          { 'mealId.name': { $regex: searchRegex } },
          { 'productId.name': { $regex: searchRegex } }
        ]
      }
    });
  }

  const countPipeline = [...pipeline, { $count: 'total' }];
  const countResult = await Review.aggregate(countPipeline);
  const total = countResult.length > 0 ? countResult[0].total : 0;

  pipeline.push({ $sort: { createdAt: -1 } });
  pipeline.push({ $skip: skip });
  pipeline.push({ $limit: limit });

  const reviews = await Review.aggregate(pipeline);

  return {
    reviews,
    pagination: { page, limit, total, pages: Math.ceil(total / limit) }
  };
};

/**
 * Delete a review (Admin only)
 */
const deleteReview = async (reviewId) => {
  const review = await Review.findById(reviewId);
  if (!review) throw new Error('Review not found');
  await review.deleteOne();
  return true;
};

/**
 * Update a review (Admin only)
 */
const updateReview = async (reviewId, updateData) => {
  const review = await Review.findById(reviewId);
  if (!review) throw new Error('Review not found');
  if (updateData.rating !== undefined) review.rating = updateData.rating;
  if (updateData.comment !== undefined) review.comment = updateData.comment;
  await review.save();
  return review;
};

module.exports = {
  addReview,
  getMealReviews,
  getDoctorReviews,
  getProductReviews,
  getDeliveryPartnerReviews,
  hasReviewed,
  getAllReviews,
  deleteReview,
  updateReview
};

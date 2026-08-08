const Review = require('./review.model');
const Order = require('../order/order.model');

/**
 * Add a review for a meal
 */
const addReview = async (parentId, reviewData) => {
  const { mealId, orderId, rating, comment } = reviewData;

  // Verify order belongs to parent and is delivered
  const order = await Order.findById(orderId);
  if (!order) {
    throw new Error('Order not found');
  }
  if (order.parentId.toString() !== parentId.toString()) {
    throw new Error('Not authorized to review this order');
  }
  if (order.status !== 'delivered') {
    throw new Error('Can only review delivered orders');
  }

  const review = await Review.create({
    parentId,
    mealId,
    orderId,
    rating,
    comment
  });

  return review;
};

/**
 * Get reviews for a specific meal
 */
const getMealReviews = async (mealId) => {
  return await Review.find({ mealId })
    .populate('parentId', 'name')
    .sort('-createdAt');
};

/**
 * Get all reviews (for Admin) with pagination, search, and filtering
 */
const getAllReviews = async (query = {}) => {
  const page = parseInt(query.page, 10) || 1;
  const limit = parseInt(query.limit, 10) || 10;
  const skip = (page - 1) * limit;

  // Build match query
  const matchQuery = {};
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
    { $unwind: { path: '$mealId', preserveNullAndEmptyArrays: true } }
  ];

  if (query.search) {
    const searchRegex = new RegExp(query.search, 'i');
    pipeline.push({
      $match: {
        $or: [
          { comment: { $regex: searchRegex } },
          { 'parentId.name': { $regex: searchRegex } },
          { 'mealId.name': { $regex: searchRegex } }
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

  // Project only needed fields to optimize
  pipeline.push({
    $project: {
      _id: 1,
      rating: 1,
      comment: 1,
      createdAt: 1,
      'parentId._id': 1,
      'parentId.name': 1,
      'mealId._id': 1,
      'mealId.name': 1,
      'mealId.type': 1
    }
  });

  const reviews = await Review.aggregate(pipeline);

  return {
    reviews,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit)
    }
  };
};

/**
 * Delete a review (Admin only)
 */
const deleteReview = async (reviewId) => {
  const review = await Review.findById(reviewId);
  if (!review) {
    throw new Error('Review not found');
  }
  await review.deleteOne();
  return true;
};

/**
 * Update a review (Admin only)
 */
const updateReview = async (reviewId, updateData) => {
  const review = await Review.findById(reviewId);
  if (!review) {
    throw new Error('Review not found');
  }
  
  if (updateData.rating !== undefined) review.rating = updateData.rating;
  if (updateData.comment !== undefined) review.comment = updateData.comment;
  
  await review.save();
  return review;
};

module.exports = {
  addReview,
  getMealReviews,
  getAllReviews,
  deleteReview,
  updateReview
};

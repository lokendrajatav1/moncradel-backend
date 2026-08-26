const Meal = require('./meal.model');
const Baby = require('../baby/baby.model');
const { uploadToCloudinary } = require('../../utils/cloudinary');

/**
 * Add a new meal (Admin or Doctor)
 */
const addMeal = async (mealData, files) => {
  let newImageUrls = [];
  if (files && files.length > 0) {
    for (const file of files) {
      const uploadResult = await uploadToCloudinary(file.buffer, 'meals');
      newImageUrls.push(uploadResult.secure_url);
    }
  }

  let finalImages = [];
  if (mealData.imageOrder) {
    const order = JSON.parse(mealData.imageOrder);
    let newImageIndex = 0;
    for (const item of order) {
      if (item.type === 'existing') {
        finalImages.push(item.url);
      } else if (item.type === 'new' && newImageIndex < newImageUrls.length) {
        finalImages.push(newImageUrls[newImageIndex]);
        newImageIndex++;
      }
    }
  } else {
    finalImages = [...newImageUrls];
  }

  const meal = await Meal.create({
    ...mealData,
    images: finalImages
  });
  return meal;
};

/**
 * Get all active meals (with pagination and search)
 */
const getAllMeals = async (query = {}) => {
  const page = parseInt(query.page, 10) || 1;
  const limit = parseInt(query.limit, 10) || 12;
  const skip = (page - 1) * limit;

  const filters = {};
  
  if (query.ageGroup && query.ageGroup !== "All Ages") {
    filters.suitableForAgeGroup = query.ageGroup;
  }
  
  if (query.category && query.category !== "All") {
    filters.category = query.category;
  }

  if (query.minPrice || query.maxPrice) {
    filters.price = {};
    if (query.minPrice) filters.price.$gte = parseInt(query.minPrice, 10);
    if (query.maxPrice) filters.price.$lte = parseInt(query.maxPrice, 10);
  }

  if (query.preferences) {
    const prefs = query.preferences.split(',');
    filters.$and = filters.$and || [];
    filters.$and.push({
      $or: [
        { name: { $in: prefs.map(p => new RegExp(p, 'i')) } },
        { ingredients: { $in: prefs.map(p => new RegExp(p, 'i')) } }
      ]
    });
  }

  if (query.search) {
    const searchRegex = new RegExp(query.search, 'i');
    filters.$and = filters.$and || [];
    filters.$and.push({
      $or: [
        { name: { $regex: searchRegex } },
        { description: { $regex: searchRegex } },
        { category: { $regex: searchRegex } },
        { ingredients: { $regex: searchRegex } }
      ]
    });
  }

  // Determine Sorting
  let sortObj = { createdAt: -1 }; // Default Newest
  if (query.sortBy === "Price: Low to High") {
    sortObj = { price: 1 };
  } else if (query.sortBy === "Price: High to Low") {
    sortObj = { price: -1 };
  } else if (query.sortBy === "Popularity") {
    // Fake popularity by keeping createdAt or adding another field
    sortObj = { createdAt: 1 }; 
  }

  const count = await Meal.countDocuments(filters);
  const meals = await Meal.find(filters)
    .sort(sortObj)
    .skip(skip)
    .limit(limit)
    .lean();

  const mealIds = meals.map(m => m._id);
  const mongooseObj = require('mongoose');
  // Need to make sure Review is loaded. It's required below as const Review = require('../review/review.model');
  // But wait, Review is required at line 109. Let me move the requirement up or just use mongoose.model('Review')
  const ReviewModel = mongooseObj.models.Review || require('../review/review.model');
  
  const reviewsInfo = await ReviewModel.aggregate([
    { $match: { mealId: { $in: mealIds }, targetType: 'meal' } },
    { $group: { _id: '$mealId', averageRating: { $avg: '$rating' }, reviewsCount: { $sum: 1 } } }
  ]);

  const reviewMap = {};
  for (const info of reviewsInfo) {
    reviewMap[info._id.toString()] = info;
  }

  for (const meal of meals) {
    const info = reviewMap[meal._id.toString()];
    if (info) {
      meal.rating = Math.round(info.averageRating * 10) / 10;
      meal.reviewsCount = info.reviewsCount;
    } else {
      meal.rating = 0;
      meal.reviewsCount = 0;
    }
  }

  return { meals, count, page, pages: Math.ceil(count / limit) };
};

const mongoose = require('mongoose');
const Review = require('../review/review.model');

/**
 * Get meal by ID
 */
const getMealById = async (id) => {
  const meal = await Meal.findById(id).lean();
  if (!meal) return null;

  const reviewsInfo = await Review.aggregate([
    { $match: { mealId: new mongoose.Types.ObjectId(id), targetType: 'meal' } },
    { $group: { _id: null, averageRating: { $avg: '$rating' }, reviewsCount: { $sum: 1 } } }
  ]);

  if (reviewsInfo.length > 0) {
    meal.rating = Math.round(reviewsInfo[0].averageRating * 10) / 10;
    meal.reviewsCount = reviewsInfo[0].reviewsCount;
  }

  return meal;
};

/**
 * Update meal
 */
const updateMeal = async (id, mealData, files) => {
  let existingImages = [];
  if (mealData.existingImages) {
    try {
      existingImages = JSON.parse(mealData.existingImages);
    } catch (e) {
      if (typeof mealData.existingImages === 'string') {
        existingImages = [mealData.existingImages];
      } else if (Array.isArray(mealData.existingImages)) {
        existingImages = mealData.existingImages;
      }
    }
  }

  let newImageUrls = [];
  if (files && files.length > 0) {
    for (const file of files) {
      const uploadResult = await uploadToCloudinary(file.buffer, 'meals');
      newImageUrls.push(uploadResult.secure_url);
    }
  }

  let finalImages = [];
  if (mealData.imageOrder) {
    const order = JSON.parse(mealData.imageOrder);
    let newImageIndex = 0;
    for (const item of order) {
      if (item.type === 'existing') {
        finalImages.push(item.url);
      } else if (item.type === 'new' && newImageIndex < newImageUrls.length) {
        finalImages.push(newImageUrls[newImageIndex]);
        newImageIndex++;
      }
    }
  } else {
    finalImages = [...existingImages, ...newImageUrls];
  }

  const updateFields = {
    ...mealData,
    images: finalImages
  };

  return await Meal.findByIdAndUpdate(id, updateFields, {
    new: true,
    runValidators: true
  });
};

/**
 * Delete meal
 */
const deleteMeal = async (id) => {
  return await Meal.findByIdAndDelete(id);
};

/**
 * Get meal filters (dynamic categories and age groups)
 */
const getMealFilters = async () => {
  const categories = await Meal.distinct('category');
  const ageGroups = await Meal.distinct('suitableForAgeGroup');
  
  return {
    categories: categories.filter(Boolean),
    ageGroups: ageGroups.filter(Boolean)
  };
};

/**
 * Get recommended meals for a baby based on allergies, age, and health symptoms
 */
const getRecommendedMeals = async (babyId) => {
  const baby = await Baby.findById(babyId);
  if (!baby) {
    throw new Error('Baby not found');
  }

  // Get all active meals
  const meals = await Meal.find({ isActive: true }).lean();
  const recommendations = [];

  // Helper for age matching
  const isAgeMatch = (ageInMonths, ageGroup) => {
    if (!ageInMonths) return false;
    if (ageGroup === '0-6 months' && ageInMonths <= 6) return true;
    if (ageGroup === '6-12 months' && ageInMonths > 6 && ageInMonths <= 12) return true;
    if (ageGroup === '1-3 years' && ageInMonths > 12 && ageInMonths <= 36) return true;
    if (ageGroup === '3+ years' && ageInMonths > 36) return true;
    return false;
  };

  // Helper to check for intersection
  const hasIntersection = (arr1, arr2) => {
    if (!arr1 || !arr2 || arr1.length === 0 || arr2.length === 0) return false;
    const lowerArr1 = arr1.map(item => item.toLowerCase());
    return arr2.some(item => lowerArr1.includes(item.toLowerCase()));
  };

  for (const meal of meals) {
    let score = 0;

    // 1. Filter out allergens
    if (hasIntersection(meal.allergens, baby.allergies)) {
      continue; // Skip this meal entirely (0 Score)
    }

    // 2. Age Matching (+10 points)
    if (isAgeMatch(baby.ageInMonths, meal.suitableForAgeGroup)) {
      score += 10;
    }

    // 3. Health Triggers (+5 points per matching symptom/tag correlation)
    if (baby.currentSymptoms && meal.tags) {
      const lowerSymptoms = baby.currentSymptoms.map(s => s.toLowerCase());
      const lowerTags = meal.tags.map(t => t.toLowerCase());

      // Example Triggers:
      if (lowerSymptoms.includes('cold') || lowerSymptoms.includes('fever')) {
        if (lowerTags.includes('immunity') || lowerTags.includes('warm') || lowerTags.includes('soup')) {
          score += 5;
        }
      }
      
      if (lowerSymptoms.includes('teething')) {
        if (lowerTags.includes('soft') || lowerTags.includes('cold') || lowerTags.includes('puree')) {
          score += 5;
        }
      }

      if (lowerSymptoms.includes('constipation')) {
        if (lowerTags.includes('high fiber') || lowerTags.includes('constipation relief')) {
          score += 5;
        }
      }
    }

    // Only recommend if there is some relevance (score > 0)
    // Actually, we can just sort all safe meals by score
    recommendations.push({
      meal,
      score
    });
  }

  // Sort descending by score
  recommendations.sort((a, b) => b.score - a.score);

  // Return Top 5 meals
  const topMeals = recommendations.slice(0, 5).map(r => r.meal);

  const mealIds = topMeals.map(m => m._id);
  const mongooseObj = require('mongoose');
  const ReviewModel = mongooseObj.models.Review || require('../review/review.model');
  const reviewsInfo = await ReviewModel.aggregate([
    { $match: { mealId: { $in: mealIds }, targetType: 'meal' } },
    { $group: { _id: '$mealId', averageRating: { $avg: '$rating' }, reviewsCount: { $sum: 1 } } }
  ]);

  const reviewMap = {};
  for (const info of reviewsInfo) {
    reviewMap[info._id.toString()] = info;
  }

  for (const meal of topMeals) {
    const info = reviewMap[meal._id.toString()];
    if (info) {
      meal.rating = Math.round(info.averageRating * 10) / 10;
      meal.reviewsCount = info.reviewsCount;
    } else {
      meal.rating = 0;
      meal.reviewsCount = 0;
    }
  }

  return topMeals;
};

module.exports = {
  addMeal,
  getAllMeals,
  getMealById,
  updateMeal,
  deleteMeal,
  getMealFilters,
  getRecommendedMeals
};

const Meal = require('./meal.model');
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
    .limit(limit);

  return { meals, count, page, pages: Math.ceil(count / limit) };
};

/**
 * Get meal by ID
 */
const getMealById = async (id) => {
  return await Meal.findById(id);
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

module.exports = {
  addMeal,
  getAllMeals,
  getMealById,
  updateMeal,
  deleteMeal,
  getMealFilters
};

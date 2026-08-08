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
  const limit = parseInt(query.limit, 10) || 10;
  const skip = (page - 1) * limit;

  const filters = {};
  if (query.ageGroup) {
    filters.suitableForAgeGroup = query.ageGroup;
  }
  if (query.search) {
    filters.name = { $regex: new RegExp(query.search, 'i') };
  }

  const count = await Meal.countDocuments(filters);
  const meals = await Meal.find(filters)
    .sort('-createdAt')
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

module.exports = {
  addMeal,
  getAllMeals,
  getMealById,
  updateMeal,
  deleteMeal
};

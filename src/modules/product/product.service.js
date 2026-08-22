const Product = require('./product.model');
const APIFeatures = require('../../utils/apiFeatures');
const { uploadToCloudinary } = require('../../utils/cloudinary');

/**
 * Add a new product
 */
const addProduct = async (productData, files) => {
  const { name, description, price, category, stockQuantity, isActive, brand, discountedPrice, sku, ageGroup, isFeatured } = productData;
  let newImageUrls = [];
  if (files && files.length > 0) {
    for (const file of files) {
      const uploadResult = await uploadToCloudinary(file.buffer, 'products');
      newImageUrls.push(uploadResult.secure_url);
    }
  }

  let finalImages = [];
  if (productData.imageOrder) {
    const order = JSON.parse(productData.imageOrder);
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
    finalImages = [...newImageUrls]; // For addProduct, if no imageOrder is passed somehow
  }

  const product = await Product.create({
    name,
    description,
    price: Number(price),
    category,
    stockQuantity: Number(stockQuantity),
    images: finalImages,
    brand,
    sku,
    ageGroup,
    ...(discountedPrice !== undefined && { discountedPrice: Number(discountedPrice) }),
    ...(isActive !== undefined && { isActive: String(isActive) === 'true' }),
    ...(isFeatured !== undefined && { isFeatured: String(isFeatured) === 'true' })
  });

  return product;
};

/**
 * Get all products
 */
const getAllProducts = async (queryString = {}) => {
  let filter = {};
  if (queryString.search) {
    const searchRegex = new RegExp(queryString.search, 'i');
    filter.$or = [
      { name: { $regex: searchRegex } },
      { description: { $regex: searchRegex } },
      { category: { $regex: searchRegex } },
      { brand: { $regex: searchRegex } }
    ];
  }
  // Always delete search so APIFeatures doesn't treat it as a database field
  delete queryString.search;

  const features = new APIFeatures(Product.find(filter), queryString)
    .filter()
    .sort()
    .paginate();

  // count total before pagination
  const countQuery = new APIFeatures(Product.find(filter), queryString).filter();
  const totalCount = await countQuery.query.countDocuments();
  
  const data = await features.query.lean();
  
  // Fetch ratings for these paginated products
  const productIds = data.map(p => p._id);
  const reviewsInfo = await Review.aggregate([
    { $match: { productId: { $in: productIds }, targetType: 'product' } },
    { $group: { _id: '$productId', averageRating: { $avg: '$rating' }, reviewsCount: { $sum: 1 } } }
  ]);

  const reviewMap = {};
  for (const info of reviewsInfo) {
    reviewMap[info._id.toString()] = info;
  }

  for (const product of data) {
    const info = reviewMap[product._id.toString()];
    if (info) {
      product.rating = Math.round(info.averageRating * 10) / 10;
      product.reviewsCount = info.reviewsCount;
    } else {
      product.rating = 0;
      product.reviewsCount = 0;
    }
  }

  return { data, totalCount };
};

const mongoose = require('mongoose');
const Review = require('../review/review.model');

/**
 * Get a single product by ID
 */
const getProductById = async (id) => {
  const product = await Product.findById(id).lean();
  if (!product) throw new Error('Product not found');

  const reviewsInfo = await Review.aggregate([
    { $match: { productId: new mongoose.Types.ObjectId(id), targetType: 'product' } },
    { $group: { _id: null, averageRating: { $avg: '$rating' }, reviewsCount: { $sum: 1 } } }
  ]);

  if (reviewsInfo.length > 0) {
    product.rating = Math.round(reviewsInfo[0].averageRating * 10) / 10;
    product.reviewsCount = reviewsInfo[0].reviewsCount;
  }

  return product;
};

/**
 * Update an existing product
 */
const updateProduct = async (id, productData, files) => {
  const { name, description, price, category, stockQuantity, isActive, brand, discountedPrice, sku, ageGroup, isFeatured } = productData;
  
  let existingImages = [];
  if (productData.existingImages) {
    try {
      existingImages = JSON.parse(productData.existingImages);
    } catch (e) {
      if (typeof productData.existingImages === 'string') {
        existingImages = [productData.existingImages];
      } else if (Array.isArray(productData.existingImages)) {
        existingImages = productData.existingImages;
      }
    }
  }

  let newImageUrls = [];
  if (files && files.length > 0) {
    for (const file of files) {
      const uploadResult = await uploadToCloudinary(file.buffer, 'products');
      newImageUrls.push(uploadResult.secure_url);
    }
  }

  let finalImages = [];
  if (productData.imageOrder) {
    const order = JSON.parse(productData.imageOrder);
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
    name,
    description,
    category,
    brand,
    sku,
    ageGroup,
    images: finalImages,
    ...(price !== undefined && { price: Number(price) }),
    ...(discountedPrice !== undefined && { discountedPrice: Number(discountedPrice) }),
    ...(stockQuantity !== undefined && { stockQuantity: Number(stockQuantity) }),
    ...(isActive !== undefined && { isActive: String(isActive) === 'true' }),
    ...(isFeatured !== undefined && { isFeatured: String(isFeatured) === 'true' })
  };

  // Remove undefined fields
  Object.keys(updateFields).forEach(key => updateFields[key] === undefined && delete updateFields[key]);

  const product = await Product.findByIdAndUpdate(
    id,
    updateFields,
    { new: true, runValidators: true }
  );

  if (!product) throw new Error('Product not found');
  return product;
};

/**
 * Delete a product
 */
const deleteProduct = async (id) => {
  const product = await Product.findByIdAndDelete(id);
  if (!product) throw new Error('Product not found');
  return product;
};

/**
 * Get product filters (dynamic categories and age groups)
 */
const getProductFilters = async () => {
  const categories = await Product.distinct('category');
  const ageGroups = await Product.distinct('ageGroup');
  
  return {
    categories: categories.filter(Boolean),
    ageGroups: ageGroups.filter(Boolean)
  };
};

module.exports = {
  addProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  getProductFilters
};

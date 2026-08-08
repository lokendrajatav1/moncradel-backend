const Banner = require('./banner.model');
const { uploadToCloudinary } = require('../../utils/cloudinary');

/**
 * Create a new banner
 */
const createBanner = async (bannerData, file) => {
  const { title, link, isActive } = bannerData;
  let imageUrl = '';

  if (file) {
    const uploadResult = await uploadToCloudinary(file.buffer, 'banners');
    imageUrl = uploadResult.secure_url;
  } else {
    throw new Error('Banner image is required');
  }

  // Handle boolean parsing if passed as string from form-data
  const activeStatus = isActive === undefined ? true : (isActive === 'true' || isActive === true);

  const banner = await Banner.create({
    title,
    imageUrl,
    link,
    isActive: activeStatus
  });

  return banner;
};

/**
 * Get banners
 */
const getBanners = async (userRole) => {
  // If Admin, show all. If user, show only active
  const filter = userRole === 'admin' ? {} : { isActive: true };
  return await Banner.find(filter).sort('-createdAt');
};

/**
 * Update a banner
 */
const updateBanner = async (id, bannerData, file) => {
  const { title, link, isActive } = bannerData;
  const updateFields = {};

  if (title !== undefined) updateFields.title = title;
  if (link !== undefined) updateFields.link = link;
  if (isActive !== undefined) {
    updateFields.isActive = (isActive === 'true' || isActive === true);
  }

  if (file) {
    const uploadResult = await uploadToCloudinary(file.buffer, 'banners');
    updateFields.imageUrl = uploadResult.secure_url;
  }

  return await Banner.findByIdAndUpdate(id, updateFields, {
    new: true,
    runValidators: true
  });
};

/**
 * Delete a banner
 */
const deleteBanner = async (id) => {
  return await Banner.findByIdAndDelete(id);
};

module.exports = {
  createBanner,
  getBanners,
  updateBanner,
  deleteBanner
};

const bannerService = require('./banner.service');

// @desc    Create a banner
// @route   POST /api/banners
// @access  Public (temporarily)
const createBanner = async (req, res, next) => {
  try {
    const banner = await bannerService.createBanner(req.body, req.file);
    res.status(201).json({ success: true, data: banner });
  } catch (error) {
    if (error.message === 'Banner image is required') {
      return res.status(400).json({ success: false, message: error.message });
    }
    next(error);
  }
};

// @desc    Get all active banners
// @route   GET /api/banners
// @access  Public
const getBanners = async (req, res, next) => {
  try {
    // Show all banners for admin panel temporarily (since we have no user session)
    const banners = await bannerService.getBanners('admin');
    res.status(200).json({ success: true, count: banners.length, data: banners });
  } catch (error) {
    next(error);
  }
};

// @desc    Update a banner
// @route   PUT /api/banners/:id
// @access  Public (temporarily)
const updateBanner = async (req, res, next) => {
  try {
    const banner = await bannerService.updateBanner(req.params.id, req.body, req.file);
    if (!banner) return res.status(404).json({ success: false, message: 'Banner not found' });
    res.status(200).json({ success: true, data: banner });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a banner
// @route   DELETE /api/banners/:id
// @access  Public (temporarily)
const deleteBanner = async (req, res, next) => {
  try {
    const banner = await bannerService.deleteBanner(req.params.id);
    if (!banner) return res.status(404).json({ success: false, message: 'Banner not found' });
    res.status(200).json({ success: true, message: 'Banner deleted successfully' });
  } catch (error) {
    next(error);
  }
};

// @desc    Reorder banners
// @route   PUT /api/banners/reorder
// @access  Public (temporarily)
const reorderBanners = async (req, res, next) => {
  try {
    const { bannerIds } = req.body;
    if (!bannerIds || !Array.isArray(bannerIds)) {
      return res.status(400).json({ success: false, message: 'bannerIds array is required' });
    }
    await bannerService.reorderBanners(bannerIds);
    res.status(200).json({ success: true, message: 'Banners reordered successfully' });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createBanner,
  getBanners,
  updateBanner,
  deleteBanner,
  reorderBanners
};

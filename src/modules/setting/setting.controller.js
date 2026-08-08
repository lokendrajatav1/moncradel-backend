const settingService = require('./setting.service');

// @desc    Get all settings
// @route   GET /api/settings
// @access  Public (so the app can load global config)
const getSettings = async (req, res, next) => {
  try {
    const config = await settingService.getSettingsConfig();
    res.status(200).json({ success: true, data: config });
  } catch (error) {
    next(error);
  }
};

// @desc    Update or Create a setting
// @route   POST /api/settings
// @access  Private (Admin)
const updateSetting = async (req, res, next) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    const setting = await settingService.updateSetting(req.body);
    res.status(200).json({ success: true, data: setting });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getSettings,
  updateSetting
};

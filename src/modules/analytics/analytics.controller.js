const analyticsService = require('./analytics.service');

// @desc    Get Admin Dashboard Analytics
// @route   GET /api/analytics/dashboard
// @access  Private (Admin)
const getDashboardAnalytics = async (req, res, next) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    const data = await analyticsService.getDashboardAnalytics();

    res.status(200).json({
      success: true,
      data
    });

  } catch (error) {
    next(error);
  }
};

module.exports = {
  getDashboardAnalytics
};

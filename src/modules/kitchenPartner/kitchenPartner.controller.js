const kitchenPartnerService = require('./kitchenPartner.service');

// @desc    Get all kitchen partners
// @route   GET /api/kitchen-partners
// @access  Private/Admin
const getKitchenPartners = async (req, res) => {
  try {
    const kitchenPartners = await kitchenPartnerService.getAllKitchenPartners(req.query);
    res.status(200).json({ success: true, count: kitchenPartners.length, data: kitchenPartners });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get single kitchen partner
// @route   GET /api/kitchen-partners/:id
// @access  Private/Admin
const getKitchenPartner = async (req, res) => {
  try {
    const kitchenPartner = await kitchenPartnerService.getKitchenPartnerById(req.params.id);
    if (!kitchenPartner) {
      return res.status(404).json({ success: false, message: 'Kitchen partner profile not found' });
    }
    res.status(200).json({ success: true, data: kitchenPartner });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update kitchen partner profile (Admin)
// @route   PUT /api/kitchen-partners/:id
// @access  Private/Admin
const updateKitchenPartner = async (req, res) => {
  try {
    const kitchenPartner = await kitchenPartnerService.updateKitchenPartner(req.params.id, req.body);
    
    if (!kitchenPartner) {
      return res.status(404).json({ success: false, message: 'Kitchen partner profile not found' });
    }
    res.status(200).json({ success: true, data: kitchenPartner });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete kitchen partner profile
// @route   DELETE /api/kitchen-partners/:id
// @access  Private/Admin
const deleteKitchenPartner = async (req, res) => {
  try {
    const kitchenPartner = await kitchenPartnerService.deleteKitchenPartner(req.params.id);
    if (!kitchenPartner) {
      return res.status(404).json({ success: false, message: 'Kitchen partner profile not found' });
    }
    res.status(200).json({ success: true, message: 'Kitchen partner profile deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getKitchenPartners,
  getKitchenPartner,
  updateKitchenPartner,
  deleteKitchenPartner
};

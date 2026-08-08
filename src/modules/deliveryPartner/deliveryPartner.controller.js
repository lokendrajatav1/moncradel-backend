const deliveryPartnerService = require('./deliveryPartner.service');

// @desc    Get all delivery partners
// @route   GET /api/delivery-partners
// @access  Private/Admin
const getDeliveryPartners = async (req, res) => {
  try {
    const deliveryPartners = await deliveryPartnerService.getAllDeliveryPartners(req.query);
    res.status(200).json({ success: true, count: deliveryPartners.length, data: deliveryPartners });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get single delivery partner
// @route   GET /api/delivery-partners/:id
// @access  Private/Admin
const getDeliveryPartner = async (req, res) => {
  try {
    const deliveryPartner = await deliveryPartnerService.getDeliveryPartnerById(req.params.id);
    if (!deliveryPartner) {
      return res.status(404).json({ success: false, message: 'Delivery partner profile not found' });
    }
    res.status(200).json({ success: true, data: deliveryPartner });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update delivery partner profile (Admin)
// @route   PUT /api/delivery-partners/:id
// @access  Private/Admin
const updateDeliveryPartner = async (req, res) => {
  try {
    const deliveryPartner = await deliveryPartnerService.updateDeliveryPartner(req.params.id, req.body);
    
    if (!deliveryPartner) {
      return res.status(404).json({ success: false, message: 'Delivery partner profile not found' });
    }
    res.status(200).json({ success: true, data: deliveryPartner });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete delivery partner profile
// @route   DELETE /api/delivery-partners/:id
// @access  Private/Admin
const deleteDeliveryPartner = async (req, res) => {
  try {
    const deliveryPartner = await deliveryPartnerService.deleteDeliveryPartner(req.params.id);
    if (!deliveryPartner) {
      return res.status(404).json({ success: false, message: 'Delivery partner profile not found' });
    }
    res.status(200).json({ success: true, message: 'Delivery partner profile deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getDeliveryPartners,
  getDeliveryPartner,
  updateDeliveryPartner,
  deleteDeliveryPartner
};

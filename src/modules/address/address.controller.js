const addressService = require('./address.service');

// @desc    Add a new address
// @route   POST /api/addresses
// @access  Private
const addAddress = async (req, res, next) => {
  try {
    let targetUserId = req.user._id;
    if (req.user.role === 'admin' && req.body.userId) {
      targetUserId = req.body.userId;
    }
    const address = await addressService.addAddress(targetUserId, req.body);
    res.status(201).json({ success: true, data: address });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all addresses for user
// @route   GET /api/addresses
// @access  Private
const getAddresses = async (req, res, next) => {
  try {
    let targetUserId = req.user._id;
    if (req.user.role === 'admin' && req.query.userId) {
      targetUserId = req.query.userId;
    }
    const addresses = await addressService.getAddresses(targetUserId);
    res.status(200).json({ success: true, count: addresses.length, data: addresses });
  } catch (error) {
    next(error);
  }
};

const updateAddress = async (req, res, next) => {
  try {
    const address = await addressService.updateAddress(req.params.id, req.body);
    if (!address) {
      return res.status(404).json({ success: false, message: 'Address not found' });
    }
    res.status(200).json({ success: true, data: address });
  } catch (error) {
    next(error);
  }
};

const deleteAddress = async (req, res, next) => {
  try {
    const address = await addressService.deleteAddress(req.params.id);
    if (!address) {
      return res.status(404).json({ success: false, message: 'Address not found' });
    }
    res.status(200).json({ success: true, data: {} });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  addAddress,
  getAddresses,
  updateAddress,
  deleteAddress
};

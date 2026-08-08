const KitchenPartner = require('./kitchenPartner.model');
const APIFeatures = require('../../utils/apiFeatures');

const getAllKitchenPartners = async (queryString = {}) => {
  const features = new APIFeatures(KitchenPartner.find().populate('user', 'name email phone role isActive'), queryString)
    .filter()
    .sort()
    .paginate();
  return await features.query;
};

const getKitchenPartnerById = async (userId) => {
  return await KitchenPartner.findOne({ user: userId }).populate('user', 'name email phone role isActive');
};

const updateKitchenPartner = async (userId, data) => {
  return await KitchenPartner.findOneAndUpdate({ user: userId }, data, {
    new: true,
    runValidators: true,
    upsert: true
  }).populate('user', 'name email phone role isActive');
};

const deleteKitchenPartner = async (userId) => {
  return await KitchenPartner.findOneAndDelete({ user: userId });
};

module.exports = {
  getAllKitchenPartners,
  getKitchenPartnerById,
  updateKitchenPartner,
  deleteKitchenPartner
};

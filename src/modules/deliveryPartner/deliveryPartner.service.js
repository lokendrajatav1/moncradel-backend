const DeliveryPartner = require('./deliveryPartner.model');
const APIFeatures = require('../../utils/apiFeatures');

const getAllDeliveryPartners = async (queryString = {}) => {
  const features = new APIFeatures(DeliveryPartner.find().populate('user', 'name email phone role isActive'), queryString)
    .filter()
    .sort()
    .paginate();
  return await features.query;
};

const getDeliveryPartnerById = async (userId) => {
  return await DeliveryPartner.findOne({ user: userId }).populate('user', 'name email phone role isActive');
};

const updateDeliveryPartner = async (userId, data) => {
  return await DeliveryPartner.findOneAndUpdate({ user: userId }, data, {
    new: true,
    runValidators: true,
    upsert: true
  }).populate('user', 'name email phone role isActive');
};

const deleteDeliveryPartner = async (userId) => {
  return await DeliveryPartner.findOneAndDelete({ user: userId });
};

module.exports = {
  getAllDeliveryPartners,
  getDeliveryPartnerById,
  updateDeliveryPartner,
  deleteDeliveryPartner
};

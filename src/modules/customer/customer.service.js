const Customer = require('./customer.model');
const APIFeatures = require('../../utils/apiFeatures');

const getAllCustomers = async (queryString = {}) => {
  const features = new APIFeatures(Customer.find().populate('user', 'name email phone role isActive'), queryString)
    .filter()
    .sort()
    .paginate();
  return await features.query;
};

const getCustomerById = async (userId) => {
  return await Customer.findOne({ user: userId }).populate('user', 'name email phone role isActive');
};

const updateCustomer = async (userId, data) => {
  return await Customer.findOneAndUpdate({ user: userId }, data, {
    new: true,
    runValidators: true,
    upsert: true
  }).populate('user', 'name email phone role isActive');
};

const deleteCustomer = async (userId) => {
  return await Customer.findOneAndDelete({ user: userId });
};

module.exports = {
  getAllCustomers,
  getCustomerById,
  updateCustomer,
  deleteCustomer
};

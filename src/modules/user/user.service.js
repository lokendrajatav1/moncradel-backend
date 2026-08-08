const User = require('./user.model');
const APIFeatures = require('../../utils/apiFeatures');

/**
 * Get all users with filtering, sorting, and pagination
 */
const getAllUsers = async (queryString = {}) => {
  const countFeatures = new APIFeatures(User.find(), queryString).filter();
  const totalCount = await countFeatures.query.countDocuments();

  const features = new APIFeatures(User.find(), queryString)
    .filter()
    .sort()
    .paginate();

  const users = await features.query.select('-password');
  
  return { users, totalCount };
};

module.exports = {
  getAllUsers
};

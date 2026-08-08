const Doctor = require('./doctor.model');
const APIFeatures = require('../../utils/apiFeatures');

const getAllDoctors = async (queryString = {}) => {
  const features = new APIFeatures(Doctor.find().populate('user', 'name email phone role isActive'), queryString)
    .filter()
    .sort()
    .paginate();
  return await features.query;
};

const getDoctorById = async (userId) => {
  return await Doctor.findOne({ user: userId }).populate('user', 'name email phone role isActive');
};

const updateDoctor = async (userId, data) => {
  return await Doctor.findOneAndUpdate({ user: userId }, data, {
    new: true,
    runValidators: true,
    upsert: true // Creates profile if it doesn't exist
  }).populate('user', 'name email phone role isActive');
};

const deleteDoctor = async (userId) => {
  return await Doctor.findOneAndDelete({ user: userId });
};

module.exports = {
  getAllDoctors,
  getDoctorById,
  updateDoctor,
  deleteDoctor
};

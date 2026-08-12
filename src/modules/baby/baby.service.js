const Baby = require('./baby.model');

/**
 * Add a new baby profile
 */
const addBaby = async (babyData, parentId) => {
  const baby = await Baby.create({
    ...babyData,
    parentId
  });
  return baby;
};

/**
 * Get all babies for a specific parent
 */
const getBabiesByParent = async (parentId) => {
  return await Baby.find({ parentId }).populate('assignedDoctorId', 'name email');
};

/**
 * Get all babies assigned to a specific doctor
 */
const getBabiesByDoctor = async (doctorId) => {
  return await Baby.find({ assignedDoctorId: doctorId }).populate('parentId', 'name phone');
};

/**
 * Get all babies (Admin only)
 */
const getAllBabies = async () => {
  return await Baby.find()
    .populate('parentId', 'name phone')
    .populate('assignedDoctorId', 'name email');
};

/**
 * Get single baby by ID
 */
const getBabyById = async (babyId) => {
  return await Baby.findById(babyId)
    .populate('parentId', 'name phone')
    .populate('assignedDoctorId', 'name email');
};

/**
 * Update baby profile
 */
const updateBaby = async (babyId, updateData) => {
  return await Baby.findByIdAndUpdate(babyId, updateData, { new: true, runValidators: true });
};

/**
 * Delete baby profile
 */
const deleteBaby = async (babyId) => {
  return await Baby.findByIdAndDelete(babyId);
};

module.exports = {
  addBaby,
  getBabiesByParent,
  getBabiesByDoctor,
  getAllBabies,
  getBabyById,
  updateBaby,
  deleteBaby
};

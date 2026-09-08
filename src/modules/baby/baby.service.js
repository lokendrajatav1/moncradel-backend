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
 * Get babies with filtering, search, and pagination
 */
const getBabies = async (query = {}) => {
  const filter = {};

  // Direct ID filters
  if (query.parentId) {
    filter.parentId = query.parentId;
  }
  if (query.assignedDoctorId) {
    filter.assignedDoctorId = query.assignedDoctorId;
  }

  // Gender filter
  if (query.gender && query.gender !== 'all') {
    filter.gender = query.gender.toLowerCase();
  }

  // Status filter
  if (query.status === 'active' || query.isActive === 'true' || query.isActive === true) {
    filter.isActive = true;
  } else if (query.status === 'inactive' || query.isActive === 'false' || query.isActive === false) {
    filter.isActive = false;
  }

  // Search filter (regex search on name, diet, medicalCondition, allergies)
  if (query.search && query.search.trim()) {
    const searchRegex = new RegExp(query.search.trim(), 'i');
    filter.$or = [
      { name: searchRegex },
      { diet: searchRegex },
      { medicalCondition: searchRegex },
      { allergies: { $in: [searchRegex] } }
    ];
  }

  // Pagination logic (if page or limit is specified)
  if (query.page || query.limit) {
    const page = Math.max(1, parseInt(query.page, 10) || 1);
    const limit = Math.max(1, parseInt(query.limit, 10) || 10);
    const skip = (page - 1) * limit;

    const total = await Baby.countDocuments(filter);
    const babies = await Baby.find(filter)
      .populate('parentId', 'name phone')
      .populate('assignedDoctorId', 'name email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    return {
      babies,
      total,
      page,
      limit,
      pages: Math.ceil(total / limit)
    };
  }

  // Unpaginated fallback (returns all matching)
  const babies = await Baby.find(filter)
    .populate('parentId', 'name phone')
    .populate('assignedDoctorId', 'name email')
    .sort({ createdAt: -1 });

  return {
    babies,
    total: babies.length,
    page: 1,
    limit: babies.length,
    pages: 1
  };
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
  getBabies,
  getBabiesByParent,
  getBabiesByDoctor,
  getAllBabies,
  getBabyById,
  updateBaby,
  deleteBaby
};

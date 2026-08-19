const Milestone = require('./milestone.model');
const { uploadToCloudinary } = require('../../utils/cloudinary');

/**
 * Add a new milestone
 */
const addMilestone = async (milestoneData, file) => {
  const { babyId, title, dateAchieved, notes, category } = milestoneData;
  let photoUrl = '';

  if (file) {
    const uploadResult = await uploadToCloudinary(file.buffer, 'milestones');
    photoUrl = uploadResult.secure_url;
  }

  const milestone = await Milestone.create({
    babyId,
    title,
    dateAchieved,
    photoUrl,
    notes,
    category
  });

  return milestone;
};

/**
 * Get milestones for a baby
 */
const getMilestones = async (babyId) => {
  return await Milestone.find({ babyId }).sort('-dateAchieved');
};

/**
 * Update a milestone
 */
const updateMilestone = async (id, updateData, file) => {
  let photoUrl;
  if (file) {
    const uploadResult = await uploadToCloudinary(file.buffer, 'milestones');
    photoUrl = uploadResult.secure_url;
    updateData.photoUrl = photoUrl;
  }
  
  const milestone = await Milestone.findByIdAndUpdate(id, updateData, {
    new: true,
    runValidators: true
  });
  
  if (!milestone) {
    const error = new Error('Milestone not found');
    error.statusCode = 404;
    throw error;
  }
  return milestone;
};

/**
 * Delete a milestone
 */
const deleteMilestone = async (id) => {
  const milestone = await Milestone.findByIdAndDelete(id);
  if (!milestone) {
    const error = new Error('Milestone not found');
    error.statusCode = 404;
    throw error;
  }
  return milestone;
};

module.exports = {
  addMilestone,
  getMilestones,
  updateMilestone,
  deleteMilestone
};

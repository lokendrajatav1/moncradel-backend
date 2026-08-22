const Growth = require('./growth.model');
const Baby = require('../baby/baby.model');

/**
 * Add a new growth record
 */
const addGrowthRecord = async (userId, growthData) => {
  const { babyId, weight, height, headCircumference, notes, recordedDate } = growthData;

  const record = await Growth.create({
    babyId,
    recordedBy: userId,
    weight,
    height,
    headCircumference,
    notes,
    recordedDate: recordedDate ? new Date(recordedDate) : Date.now()
  });

  const updateData = {};
  if (weight !== undefined) updateData.weight = weight;
  if (height !== undefined) updateData.height = height;

  if (Object.keys(updateData).length > 0) {
    await Baby.findByIdAndUpdate(babyId, updateData);
  }

  return record;
};

/**
 * Get growth records for a baby
 */
const getGrowthRecords = async (babyId) => {
  return await Growth.find({ babyId })
    .populate('recordedBy', 'name role')
    .sort('createdAt'); // Sort ascending to plot on a graph
};

/**
 * Update a growth record
 */
const updateGrowthRecord = async (id, growthData) => {
  const record = await Growth.findByIdAndUpdate(id, growthData, {
    new: true,
    runValidators: true
  });
  
  if (!record) {
    throw new Error('Growth record not found');
  }

  const updateData = {};
  if (growthData.weight !== undefined) updateData.weight = growthData.weight;
  if (growthData.height !== undefined) updateData.height = growthData.height;

  if (Object.keys(updateData).length > 0) {
    await Baby.findByIdAndUpdate(record.babyId, updateData);
  }

  return record;
};

/**
 * Delete a growth record
 */
const deleteGrowthRecord = async (id) => {
  const record = await Growth.findById(id);
  if (!record) {
    throw new Error('Growth record not found');
  }
  
  await record.deleteOne();
  return true;
};

module.exports = {
  addGrowthRecord,
  getGrowthRecords,
  updateGrowthRecord,
  deleteGrowthRecord
};

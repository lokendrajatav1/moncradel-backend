const Growth = require('./growth.model');
const Baby = require('../baby/baby.model');

/**
 * Add a new growth record
 */
const addGrowthRecord = async (userId, growthData) => {
  const { babyId, weight, height, headCircumference, notes } = growthData;

  const record = await Growth.create({
    babyId,
    recordedBy: userId,
    weight,
    height,
    headCircumference,
    notes
  });

  // Optionally update the Baby's current weight based on the latest record
  await Baby.findByIdAndUpdate(babyId, { weight: weight });

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

  // Optionally update Baby's weight if this is the latest record, but for simplicity we skip here
  if (growthData.weight) {
    await Baby.findByIdAndUpdate(record.babyId, { weight: growthData.weight });
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

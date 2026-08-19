const Hygiene = require('./hygiene.model');
const { uploadToCloudinary } = require('../../utils/cloudinary');

/**
 * Log a new hygiene task
 */
const logHygieneTask = async (kitchenId, taskData, file) => {
  const { taskName, date, status } = taskData;
  let photoUrl = '';

  if (file) {
    const uploadResult = await uploadToCloudinary(file.buffer, 'hygiene');
    photoUrl = uploadResult.secure_url;
  }

  const log = await Hygiene.create({
    kitchenId,
    taskName,
    date,
    status: status || 'completed',
    photoUrl
  });

  return log;
};

/**
 * Get all hygiene logs with pagination and search
 */
const getHygieneLogs = async (query = {}) => {
  const page = parseInt(query.page, 10) || 1;
  const limit = parseInt(query.limit, 10) || 10;
  const skip = (page - 1) * limit;

  let pipeline = [];
  let initialMatch = {};

  if (query.kitchenId) {
    const mongoose = require('mongoose');
    // Ensure we handle either ObjectId or string properly
    try {
      initialMatch.kitchenId = new mongoose.Types.ObjectId(query.kitchenId);
    } catch (e) {
      initialMatch.kitchenId = query.kitchenId;
    }
  }

  if (query.date) {
    initialMatch.date = query.date;
  }

  if (Object.keys(initialMatch).length > 0) {
    pipeline.push({ $match: initialMatch });
  }

  pipeline.push(
    {
      $lookup: {
        from: 'users',
        localField: 'kitchenId',
        foreignField: '_id',
        as: 'kitchenId'
      }
    },
    { $unwind: { path: '$kitchenId', preserveNullAndEmptyArrays: true } }
  );

  if (query.search) {
    const searchRegex = new RegExp(query.search, 'i');
    pipeline.push({
      $match: {
        $or: [
          { taskName: { $regex: searchRegex } },
          { 'kitchenId.name': { $regex: searchRegex } }
        ]
      }
    });
  }

  const countPipeline = [...pipeline, { $count: 'total' }];
  const countResult = await Hygiene.aggregate(countPipeline);
  const total = countResult.length > 0 ? countResult[0].total : 0;

  pipeline.push({ $sort: { date: -1 } });
  pipeline.push({ $skip: skip });
  pipeline.push({ $limit: limit });

  // Project to optimize output
  pipeline.push({
    $project: {
      _id: 1,
      taskName: 1,
      date: 1,
      status: 1,
      photoUrl: 1,
      'kitchenId._id': 1,
      'kitchenId.name': 1
    }
  });

  const logs = await Hygiene.aggregate(pipeline);

  return {
    logs,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit)
    }
  };
};

/**
 * Update a hygiene task
 */
const updateHygieneTask = async (id, updateData, file) => {
  const payload = { ...updateData };
  if (file) {
    const uploadResult = await uploadToCloudinary(file.buffer, 'hygiene');
    payload.photoUrl = uploadResult.secure_url;
  }

  const log = await Hygiene.findByIdAndUpdate(id, payload, { new: true });
  if (!log) throw new Error('Hygiene task not found');
  return log;
};

/**
 * Delete a hygiene task
 */
const deleteHygieneTask = async (id) => {
  const log = await Hygiene.findByIdAndDelete(id);
  if (!log) throw new Error('Hygiene task not found');
  return log;
};

module.exports = {
  logHygieneTask,
  getHygieneLogs,
  updateHygieneTask,
  deleteHygieneTask
};

const Batch = require('./batch.model');
const Order = require('../order/order.model');

/**
 * Create a new batch from pending orders
 */
const createBatch = async (kitchenId, batchData) => {
  const { mealId, quantity } = batchData;

  // 1. Generate unique batch number
  const batchNumber = `BATCH-${Date.now()}`;

  // 2. Find pending orders for this meal, limited by quantity
  const pendingOrders = await Order.find({ 
    'items.mealId': mealId, 
    status: 'pending',
    kitchenId: { $in: [null, undefined] } // Ensure it's not already assigned
  })
    .limit(quantity)
    .select('_id');
  
  const orderIds = pendingOrders.map(order => order._id);

  // 3. Create the batch — orders stay 'pending' until kitchen marks batch as 'preparing'
  const batch = await Batch.create({
    batchNumber,
    mealId,
    quantity,
    orderIds,
    cookedBy: kitchenId,
    status: 'pending'
  });

  // Assign the linked orders to this kitchen
  if (orderIds.length > 0) {
    await Order.updateMany(
      { _id: { $in: orderIds } },
      { $set: { kitchenId } }
    );
  }

  return batch;
};

/**
 * Update batch status and automate order updates
 */
const updateBatchStatus = async (batchId, statusData, io) => {
  const { status } = statusData;

  const batch = await Batch.findByIdAndUpdate(
    batchId,
    { status },
    { new: true }
  );

  if (!batch) throw new Error('Batch not found');

  // AUTOMATION: If batch is ready, specific items become 'ready'
  if (status === 'ready' && batch.orderIds && batch.orderIds.length > 0) {
    await Order.updateMany(
      { _id: { $in: batch.orderIds } },
      { $set: { 'items.$[elem].status': 'ready' } },
      { arrayFilters: [{ 'elem.mealId': batch.mealId }] }
    );
    
    // Check if parent orders are fully ready
    const orders = await Order.find({ _id: { $in: batch.orderIds } });
    for (const order of orders) {
      const allReady = order.items.every(item => item.status === 'ready');
      if (allReady && order.status !== 'ready') {
        order.status = 'ready';
        order.readyAt = new Date();
        await order.save();
        if (io) {
          io.to(`order_${order._id}`).emit('status_update', { orderId: order._id, status: 'ready' });
        }
      }
    }
  }

  // AUTOMATION: If batch is preparing, specific items become 'preparing'
  if (status === 'preparing' && batch.orderIds && batch.orderIds.length > 0) {
    await Order.updateMany(
      { _id: { $in: batch.orderIds } },
      { 
        $set: { 
          'items.$[elem].status': 'preparing',
          status: 'preparing', // parent becomes preparing if any item is preparing
          preparingAt: new Date()
        } 
      },
      { arrayFilters: [{ 'elem.mealId': batch.mealId }] }
    );
  }

  return batch;
};

/**
 * Get all batches
 */
const getBatches = async (query = {}) => {
  const page = parseInt(query.page, 10) || 1;
  const limit = parseInt(query.limit, 10) || 10;
  const skip = (page - 1) * limit;

  let pipeline = [];
  let initialMatch = {};

  if (query.kitchenId) {
    const mongoose = require('mongoose');
    try {
      initialMatch.cookedBy = new mongoose.Types.ObjectId(query.kitchenId);
    } catch(e) {
      initialMatch.cookedBy = query.kitchenId;
    }
  }

  if (Object.keys(initialMatch).length > 0) {
    pipeline.push({ $match: initialMatch });
  }

  pipeline.push(
    {
      $lookup: {
        from: 'meals',
        localField: 'mealId',
        foreignField: '_id',
        as: 'mealId'
      }
    },
    { $unwind: { path: '$mealId', preserveNullAndEmptyArrays: true } }
  );

  if (query.search) {
    const searchRegex = new RegExp(query.search, 'i');
    pipeline.push({
      $match: {
        $or: [
          { batchNumber: { $regex: searchRegex } },
          { status: { $regex: searchRegex } },
          { 'mealId.name': { $regex: searchRegex } }
        ]
      }
    });
  }

  const countPipeline = [...pipeline, { $count: 'total' }];
  const countResult = await Batch.aggregate(countPipeline);
  const total = countResult.length > 0 ? countResult[0].total : 0;

  pipeline.push({ $sort: { createdAt: -1 } });
  pipeline.push({ $skip: skip });
  pipeline.push({ $limit: limit });

  const batches = await Batch.aggregate(pipeline);

  return {
    batches,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit)
    }
  };
};

/**
 * Delete a batch — only allowed if status is 'pending'
 * Reverts any linked orders back to 'pending'
 */
const deleteBatch = async (batchId) => {
  const batch = await Batch.findById(batchId);

  if (!batch) throw new Error('Batch not found');

  // Industry standard: only pending batches can be cancelled/deleted
  if (batch.status !== 'pending') {
    throw new Error('Only pending batches can be deleted. Cancel is not allowed once cooking has started.');
  }

  // Revert linked orders back to 'pending' so they can be re-batched
  if (batch.orderIds && batch.orderIds.length > 0) {
    await Order.updateMany(
      { _id: { $in: batch.orderIds } },
      { status: 'pending', $unset: { kitchenId: '' } }
    );
  }

  await Batch.findByIdAndDelete(batchId);

  return { message: 'Batch cancelled and orders reverted to pending.' };
};

module.exports = {
  createBatch,
  updateBatchStatus,
  getBatches,
  deleteBatch
};

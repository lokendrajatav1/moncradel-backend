const Inventory = require('./inventory.model');

/**
 * Get all inventory items
 */
const getInventory = async () => {
  return await Inventory.find().sort('-createdAt');
};

/**
 * Create a new inventory item
 */
const createInventory = async (inventoryData) => {
  const item = await Inventory.create(inventoryData);
  return item;
};

/**
 * Update an inventory item
 */
const updateInventory = async (itemId, inventoryData) => {
  const item = await Inventory.findByIdAndUpdate(itemId, inventoryData, {
    new: true,
    runValidators: true
  });

  if (!item) throw new Error('Inventory item not found');
  return item;
};

/**
 * Delete an inventory item
 */
const deleteInventory = async (itemId) => {
  const item = await Inventory.findByIdAndDelete(itemId);
  if (!item) throw new Error('Inventory item not found');
  return item;
};

module.exports = {
  getInventory,
  createInventory,
  updateInventory,
  deleteInventory
};

const inventoryService = require('./inventory.service');

const getInventory = async (req, res, next) => {
  try {
    const items = await inventoryService.getInventory();
    res.status(200).json({ success: true, count: items.length, data: items });
  } catch (error) {
    next(error);
  }
};

const createInventory = async (req, res, next) => {
  try {
    const item = await inventoryService.createInventory(req.body);
    res.status(201).json({ success: true, data: item });
  } catch (error) {
    next(error);
  }
};

const updateInventory = async (req, res, next) => {
  try {
    const item = await inventoryService.updateInventory(req.params.id, req.body);
    res.status(200).json({ success: true, data: item });
  } catch (error) {
    if (error.message === 'Inventory item not found') {
      return res.status(404).json({ success: false, message: error.message });
    }
    next(error);
  }
};

const deleteInventory = async (req, res, next) => {
  try {
    await inventoryService.deleteInventory(req.params.id);
    res.status(200).json({ success: true, data: {} });
  } catch (error) {
    if (error.message === 'Inventory item not found') {
      return res.status(404).json({ success: false, message: error.message });
    }
    next(error);
  }
};

module.exports = {
  getInventory,
  createInventory,
  updateInventory,
  deleteInventory
};

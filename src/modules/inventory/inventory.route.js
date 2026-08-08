const express = require('express');
const router = express.Router();
const { getInventory, createInventory, updateInventory, deleteInventory } = require('./inventory.controller');
const { protect } = require('../../middleware/auth');
const validate = require('../../middleware/validate');
const { inventorySchema, updateInventorySchema } = require('./inventory.validation');

// Now fully protected and validated
router.route('/')
  .get(protect, getInventory)
  .post(protect, validate(inventorySchema), createInventory);

router.route('/:id')
  .put(protect, validate(updateInventorySchema), updateInventory)
  .delete(protect, deleteInventory);

module.exports = router;

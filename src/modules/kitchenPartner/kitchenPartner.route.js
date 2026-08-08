const express = require('express');
const router = express.Router();
const { getKitchenPartners, getKitchenPartner, updateKitchenPartner, deleteKitchenPartner } = require('./kitchenPartner.controller');
const { protect, authorize } = require('../../middleware/auth');
const validate = require('../../middleware/validate');
const { updateKitchenPartnerSchema } = require('./kitchenPartner.validation');

// All kitchen partner routes are protected and restricted to admin
router.use(protect);
router.use(authorize('admin'));

router.route('/')
  .get(getKitchenPartners);

router.route('/:id')
  .get(getKitchenPartner)
  .put(validate(updateKitchenPartnerSchema), updateKitchenPartner)
  .delete(deleteKitchenPartner);

module.exports = router;

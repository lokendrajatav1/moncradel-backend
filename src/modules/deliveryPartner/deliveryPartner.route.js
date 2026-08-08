const express = require('express');
const router = express.Router();
const { getDeliveryPartners, getDeliveryPartner, updateDeliveryPartner, deleteDeliveryPartner } = require('./deliveryPartner.controller');
const { protect, authorize } = require('../../middleware/auth');
const validate = require('../../middleware/validate');
const { updateDeliveryPartnerSchema } = require('./deliveryPartner.validation');

// All delivery partner routes are protected and restricted to admin
router.use(protect);
router.use(authorize('admin'));

router.route('/')
  .get(getDeliveryPartners);

router.route('/:id')
  .get(getDeliveryPartner)
  .put(validate(updateDeliveryPartnerSchema), updateDeliveryPartner)
  .delete(deleteDeliveryPartner);

module.exports = router;

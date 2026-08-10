const express = require('express');
const router = express.Router();
const { getDoctors, getDoctor, updateDoctor, deleteDoctor, getAvailableSlots } = require('./doctor.controller');
const { protect, authorize } = require('../../middleware/auth');
const validate = require('../../middleware/validate');
const { updateDoctorSchema } = require('./doctor.validation');

router.get('/', getDoctors);
router.get('/:id/available-slots', getAvailableSlots);
router.get('/:id', getDoctor);

// Admin-only routes
router.use(protect);
router.use(authorize('admin'));

router.route('/:id')
  .put(validate(updateDoctorSchema), updateDoctor)
  .delete(deleteDoctor);

module.exports = router;

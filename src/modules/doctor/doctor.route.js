const express = require('express');
const router = express.Router();
const { getDoctors, getDoctor, updateDoctor, deleteDoctor } = require('./doctor.controller');
const { protect, authorize } = require('../../middleware/auth');
const validate = require('../../middleware/validate');
const { updateDoctorSchema } = require('./doctor.validation');

// All doctor routes are protected and restricted to admin
router.use(protect);
router.use(authorize('admin'));

router.route('/')
  .get(getDoctors);

router.route('/:id')
  .get(getDoctor)
  .put(validate(updateDoctorSchema), updateDoctor)
  .delete(deleteDoctor);

module.exports = router;

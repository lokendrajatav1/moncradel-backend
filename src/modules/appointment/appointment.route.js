const express = require('express');
const router = express.Router();
const { createAppointment, getAppointments, updateAppointmentStatus, updateAppointment, deleteAppointment } = require('./appointment.controller');
const { protect } = require('../../middleware/auth');
const validate = require('../../middleware/validate');
const { appointmentSchema } = require('./appointment.validation');

router.route('/')
  .post(protect, validate(appointmentSchema), createAppointment)
  .get(protect, getAppointments);

router.route('/:id')
  .put(protect, validate(appointmentSchema), updateAppointment)
  .delete(protect, deleteAppointment);

router.route('/:id/status')
  .patch(protect, updateAppointmentStatus);

module.exports = router;

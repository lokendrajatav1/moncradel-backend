const appointmentService = require('./appointment.service');
const eventEmitter = require('../../events/eventEmitter');

// @desc    Create a new appointment
// @route   POST /api/appointments
// @access  Private (Parent, Admin)
const createAppointment = async (req, res, next) => {
  try {
    if (req.user.role !== 'parent' && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized to book appointments' });
    }

    const parentId = req.user.role === 'admin' ? req.body.parentId : req.user._id;
    if (!parentId) {
      return res.status(400).json({ success: false, message: 'parentId is required when booking as admin' });
    }

    const appointment = await appointmentService.createAppointment(parentId, req.body);
    
    // Notify listeners about the new appointment
    eventEmitter.emit('appointment.created', { appointment, user: req.user });

    res.status(201).json({ success: true, data: appointment });
  } catch (error) {
    next(error);
  }
};

// @desc    Get appointments
// @route   GET /api/appointments
// @access  Private
const getAppointments = async (req, res, next) => {
  try {
    const { data, totalCount } = await appointmentService.getAppointments(req.user.role, req.user._id, req.query);
    res.status(200).json({ success: true, count: data.length, total: totalCount, data });
  } catch (error) {
    next(error);
  }
};

// @desc    Update appointment status
// @route   PATCH /api/appointments/:id/status
// @access  Private (Doctor)
const updateAppointmentStatus = async (req, res, next) => {
  try {
    const appointment = await appointmentService.updateAppointmentStatus(req.params.id, req.body);
    res.status(200).json({ success: true, data: appointment });
  } catch (error) {
    if (error.message === 'Appointment not found') {
      return res.status(404).json({ success: false, message: 'Appointment not found' });
    }
    next(error);
  }
};

// @desc    Update appointment details
// @route   PUT /api/appointments/:id
// @access  Private (Admin, Doctor)
const updateAppointment = async (req, res, next) => {
  try {
    const appointment = await appointmentService.updateAppointment(req.params.id, req.body);
    res.status(200).json({ success: true, data: appointment });
  } catch (error) {
    if (error.message === 'Appointment not found') {
      return res.status(404).json({ success: false, message: 'Appointment not found' });
    }
    next(error);
  }
};

// @desc    Delete appointment
// @route   DELETE /api/appointments/:id
// @access  Private (Admin)
const deleteAppointment = async (req, res, next) => {
  try {
    const appointment = await appointmentService.deleteAppointment(req.params.id);
    res.status(200).json({ success: true, data: {} });
  } catch (error) {
    if (error.message === 'Appointment not found') {
      return res.status(404).json({ success: false, message: 'Appointment not found' });
    }
    next(error);
  }
};

module.exports = {
  createAppointment,
  getAppointments,
  updateAppointmentStatus,
  updateAppointment,
  deleteAppointment
};

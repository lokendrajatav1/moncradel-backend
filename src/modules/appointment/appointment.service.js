const Appointment = require('./appointment.model');
const User = require('../user/user.model');
const Baby = require('../baby/baby.model');
const APIFeatures = require('../../utils/apiFeatures');

/**
 * Create a new appointment
 */
const createAppointment = async (parentId, appointmentData) => {
  const { doctorId, babyId, date, time, notes } = appointmentData;

  const appointment = await Appointment.create({
    parentId,
    doctorId,
    babyId,
    date,
    time,
    notes
  });

  return appointment;
};

/**
 * Get appointments based on role
 */
const getAppointments = async (userRole, userId, queryString = {}) => {
  let filters = {};
  if (userRole === 'parent') {
    filters.parentId = userId;
  } else if (userRole === 'doctor') {
    filters.doctorId = userId;
  }

  // Handle Search across Parent, Doctor, Baby names
  if (queryString.search) {
    const searchRegex = new RegExp(queryString.search, 'i');
    
    // Find matching Users (Parents or Doctors)
    const matchingUsers = await User.find({ name: searchRegex }).select('_id');
    const userIds = matchingUsers.map(u => u._id);
    
    // Find matching Babies
    const matchingBabies = await Baby.find({ name: searchRegex }).select('_id');
    const babyIds = matchingBabies.map(b => b._id);
    
    filters.$or = [
      { parentId: { $in: userIds } },
      { doctorId: { $in: userIds } },
      { babyId: { $in: babyIds } }
    ];
    
    // Remove search from queryString so APIFeatures doesn't try to use it directly
    delete queryString.search;
  }

  const features = new APIFeatures(Appointment.find(filters), queryString).filter();

  const countQuery = features.query.clone();
  const totalCount = await countQuery.countDocuments();

  features.sort().paginate();

  const data = await features.query
    .populate('babyId', 'name ageInMonths')
    .populate('doctorId', 'name')
    .populate('parentId', 'name phone');

  return { data, totalCount };
};

/**
 * Update appointment status
 */
const updateAppointmentStatus = async (appointmentId, statusData) => {
  const { status, meetingLink, cancellationReason } = statusData;
  const updatePayload = { status, meetingLink };
  
  if (status === 'cancelled') {
    updatePayload.cancelledAt = Date.now();
    if (cancellationReason) {
      updatePayload.cancellationReason = cancellationReason;
    }
  } else if (status === 'completed') {
    updatePayload.completedAt = Date.now();
  }

  const appointment = await Appointment.findByIdAndUpdate(
    appointmentId,
    updatePayload,
    { new: true }
  );

  if (!appointment) throw new Error('Appointment not found');
  return appointment;
};

/**
 * Update appointment details
 */
const updateAppointment = async (appointmentId, updateData) => {
  if (updateData.status === 'cancelled' && !updateData.cancelledAt) {
    updateData.cancelledAt = Date.now();
  } else if (updateData.status === 'completed' && !updateData.completedAt) {
    updateData.completedAt = Date.now();
  }

  const appointment = await Appointment.findByIdAndUpdate(
    appointmentId,
    updateData,
    { new: true }
  );
  if (!appointment) throw new Error('Appointment not found');
  return appointment;
};

/**
 * Delete an appointment
 */
const deleteAppointment = async (appointmentId) => {
  const appointment = await Appointment.findByIdAndDelete(appointmentId);
  if (!appointment) throw new Error('Appointment not found');
  return appointment;
};

module.exports = {
  createAppointment,
  getAppointments,
  updateAppointmentStatus,
  updateAppointment,
  deleteAppointment
};

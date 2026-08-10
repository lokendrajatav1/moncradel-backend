const Doctor = require('./doctor.model');
const APIFeatures = require('../../utils/apiFeatures');

const getAllDoctors = async (queryString = {}) => {
  const features = new APIFeatures(Doctor.find().populate('user', 'name email phone role isActive avatar'), queryString)
    .filter()
    .sort()
    .paginate();
  return await features.query;
};

const getDoctorById = async (userId) => {
  return await Doctor.findOne({ user: userId }).populate('user', 'name email phone role isActive avatar');
};

const updateDoctor = async (userId, data) => {
  return await Doctor.findOneAndUpdate({ user: userId }, data, {
    new: true,
    runValidators: true,
    upsert: true // Creates profile if it doesn't exist
  }).populate('user', 'name email phone role isActive');
};

const deleteDoctor = async (userId) => {
  return await Doctor.findOneAndDelete({ user: userId });
};

const Appointment = require('../appointment/appointment.model');

const generateSlots = (shifts, slotDuration) => {
  const slots = [];
  
  const parseTime = (timeStr) => {
    const [hours, minutes] = timeStr.split(':').map(Number);
    return hours * 60 + minutes;
  };
  
  const formatTime = (minutes) => {
    const h = Math.floor(minutes / 60);
    const m = minutes % 60;
    const ampm = h >= 12 ? 'PM' : 'AM';
    const displayH = h % 12 || 12;
    return `${String(displayH).padStart(2, '0')}:${String(m).padStart(2, '0')} ${ampm}`;
  };

  if (!shifts || !Array.isArray(shifts)) return slots;

  shifts.forEach(shift => {
    if (!shift.startTime || !shift.endTime) return;
    let current = parseTime(shift.startTime);
    const end = parseTime(shift.endTime);
    
    while (current + slotDuration <= end) {
      slots.push(formatTime(current));
      current += slotDuration;
    }
  });
  
  return slots;
};

const getAvailableSlots = async (userId, date) => {
  const doctorProfile = await Doctor.findOne({ user: userId });
  if (!doctorProfile) throw new Error('Doctor profile not found');

  const parsedDate = new Date(date);
  const dayName = parsedDate.toLocaleDateString('en-US', { weekday: 'long' });

  // Find shifts for this day
  const daySchedule = doctorProfile.availability?.find(a => a.dayOfWeek === dayName);
  const shifts = daySchedule?.shifts || [];
  const slotDuration = doctorProfile.slotDuration || 30;

  const baseSlots = generateSlots(shifts, slotDuration);

  // Find booked appointments for this date (excluding cancelled ones)
  const appointments = await Appointment.find({ doctorId: userId, date, status: { $ne: 'cancelled' } });
  const bookedTimes = appointments.map(app => app.time);

  // Filter available slots
  const availableSlots = baseSlots.filter(slot => !bookedTimes.includes(slot));
  return availableSlots;
};

module.exports = {
  getAllDoctors,
  getDoctorById,
  updateDoctor,
  deleteDoctor,
  getAvailableSlots
};

const Doctor = require('./doctor.model');
const Review = require('../review/review.model');
const APIFeatures = require('../../utils/apiFeatures');

const getAllDoctors = async (queryString = {}) => {
  const features = new APIFeatures(Doctor.find().populate('user', 'name email phone role isActive avatar'), queryString)
    .filter()
    .sort()
    .paginate();
  const doctors = await features.query.lean();

  // Aggregate reviews for all doctors
  const doctorUserIds = doctors.map(d => d.user?._id || d.user).filter(Boolean);
  const doctorDocIds = doctors.map(d => d._id).filter(Boolean);
  const allIds = [...doctorUserIds, ...doctorDocIds];

  const reviewsInfo = await Review.aggregate([
    { $match: { doctorId: { $in: allIds }, targetType: 'doctor' } },
    { $group: { _id: '$doctorId', averageRating: { $avg: '$rating' }, reviewsCount: { $sum: 1 } } }
  ]);

  const reviewMap = {};
  reviewsInfo.forEach(info => {
    reviewMap[info._id.toString()] = info;
  });

  doctors.forEach(doc => {
    const userIdStr = doc.user?._id?.toString() || doc.user?.toString();
    const docIdStr = doc._id?.toString();
    const info = reviewMap[userIdStr] || reviewMap[docIdStr];
    if (info) {
      doc.rating = Math.round(info.averageRating * 10) / 10;
      doc.reviewsCount = info.reviewsCount;
    } else {
      doc.rating = doc.rating || 0;
      doc.reviewsCount = doc.reviewsCount || 0;
    }
  });

  return doctors;
};

const getDoctorById = async (userId) => {
  const doctor = await Doctor.findOne({ user: userId }).populate('user', 'name email phone role isActive avatar').lean();
  if (!doctor) return null;

  const userObjId = doctor.user?._id || doctor.user;
  const reviewsInfo = await Review.aggregate([
    { $match: { doctorId: { $in: [userObjId, doctor._id] }, targetType: 'doctor' } },
    { $group: { _id: null, averageRating: { $avg: '$rating' }, reviewsCount: { $sum: 1 } } }
  ]);

  if (reviewsInfo.length > 0) {
    doctor.rating = Math.round(reviewsInfo[0].averageRating * 10) / 10;
    doctor.reviewsCount = reviewsInfo[0].reviewsCount;
  }

  return doctor;
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

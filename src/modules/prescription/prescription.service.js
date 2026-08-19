const Prescription = require('./prescription.model');
const { uploadToCloudinary } = require('../../utils/cloudinary');

/**
 * Upload a prescription
 */
const uploadPrescription = async (userId, data, file, userRole = 'doctor') => {
  const { babyId, medicalNotes, nutritionRecommendations, medicines, vitals, nextVisitDate } = data;
  let fileUrl = '';

  if (file) {
    const uploadResult = await uploadToCloudinary(file.buffer, 'prescriptions');
    fileUrl = uploadResult.secure_url;
  }

  const isParent = userRole === 'parent';

  const prescriptionData = {
    babyId,
    doctorId: isParent ? null : userId,  // parent uploads have no doctorId
    uploadedByParent: isParent,
    fileUrl,
    medicalNotes,
    nutritionRecommendations
  };

  if (medicines) prescriptionData.medicines = JSON.parse(medicines);
  if (vitals) prescriptionData.vitals = JSON.parse(vitals);
  if (nextVisitDate) prescriptionData.nextVisitDate = nextVisitDate;

  const prescription = await Prescription.create(prescriptionData);

  return prescription;
};

/**
 * Get prescriptions for a baby
 */
const getPrescriptions = async (babyId) => {
  const prescriptions = await Prescription.find({ babyId })
    .populate('doctorId', 'name avatar')
    .populate({
      path: 'babyId',
      select: 'name parentId',
      populate: { path: 'parentId', select: 'name avatar' }
    })
    .sort('-createdAt')
    .lean();

  const doctorIds = prescriptions.map(p => p.doctorId?._id).filter(Boolean);
  const Doctor = require('../doctor/doctor.model');
  const doctors = await Doctor.find({ user: { $in: doctorIds } }).select('user specialization');
  const docMap = {};
  doctors.forEach(d => { docMap[d.user.toString()] = d.specialization; });

  return prescriptions.map(p => {
    if (p.doctorId && p.doctorId._id) {
      p.doctorId.specialization = docMap[p.doctorId._id.toString()] || 'Specialist';
    }
    return p;
  });
};

const getAllPrescriptions = async () => {
  const prescriptions = await Prescription.find()
    .populate({
      path: 'babyId',
      select: 'name parentId',
      populate: { path: 'parentId', select: 'name avatar' }
    })
    .populate('doctorId', 'name email avatar')
    .sort('-createdAt')
    .lean();

  const doctorIds = prescriptions.map(p => p.doctorId?._id).filter(Boolean);
  const Doctor = require('../doctor/doctor.model');
  const doctors = await Doctor.find({ user: { $in: doctorIds } }).select('user specialization');
  const docMap = {};
  doctors.forEach(d => { docMap[d.user.toString()] = d.specialization; });

  return prescriptions.map(p => {
    if (p.doctorId && p.doctorId._id) {
      p.doctorId.specialization = docMap[p.doctorId._id.toString()] || 'Specialist';
    }
    return p;
  });
};

const updatePrescription = async (id, data, file) => {
  let updateData = {
    medicalNotes: data.medicalNotes,
    nutritionRecommendations: data.nutritionRecommendations
  };

  if (data.medicines) updateData.medicines = JSON.parse(data.medicines);
  if (data.vitals) updateData.vitals = JSON.parse(data.vitals);
  if (data.nextVisitDate) updateData.nextVisitDate = data.nextVisitDate;

  if (file) {
    const uploadResult = await uploadToCloudinary(file.buffer, 'prescriptions');
    updateData.fileUrl = uploadResult.secure_url;
  }

  const prescription = await Prescription.findByIdAndUpdate(id, updateData, { new: true, runValidators: true });
  if (!prescription) {
    const error = new Error('Prescription not found');
    error.statusCode = 404;
    throw error;
  }
  return prescription;
};

const deletePrescription = async (id) => {
  const prescription = await Prescription.findByIdAndDelete(id);
  if (!prescription) {
    const error = new Error('Prescription not found');
    error.statusCode = 404;
    throw error;
  }
  return prescription;
};

module.exports = {
  uploadPrescription,
  getPrescriptions,
  getAllPrescriptions,
  updatePrescription,
  deletePrescription
};

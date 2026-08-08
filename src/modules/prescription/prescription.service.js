const Prescription = require('./prescription.model');
const { uploadToCloudinary } = require('../../utils/cloudinary');

/**
 * Upload a prescription
 */
const uploadPrescription = async (doctorId, data, file) => {
  const { babyId, medicalNotes, nutritionRecommendations, medicines, vitals, nextVisitDate } = data;
  let fileUrl = '';

  if (file) {
    const uploadResult = await uploadToCloudinary(file.buffer, 'prescriptions');
    fileUrl = uploadResult.secure_url;
  }

  const prescriptionData = {
    babyId,
    doctorId,
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
  return await Prescription.find({ babyId })
    .populate('doctorId', 'name')
    .sort('-createdAt');
};

const getAllPrescriptions = async () => {
  return await Prescription.find().populate('babyId', 'name').populate('doctorId', 'name email').sort('-createdAt');
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

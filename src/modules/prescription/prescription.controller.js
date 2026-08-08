const prescriptionService = require('./prescription.service');

// @desc    Upload a prescription
// @route   POST /api/prescriptions
// @access  Private (Doctor)
const uploadPrescription = async (req, res, next) => {
  try {
    if (req.user.role !== 'doctor' && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Only doctors or admins can upload prescriptions' });
    }

    const userId = req.user._id || req.user.id;
    const prescription = await prescriptionService.uploadPrescription(userId, req.body, req.file);
    res.status(201).json({ success: true, data: prescription });
  } catch (error) {
    next(error);
  }
};

// @desc    Get prescriptions for a baby
// @route   GET /api/prescriptions/:babyId
// @access  Private
const getPrescriptions = async (req, res, next) => {
  try {
    const prescriptions = await prescriptionService.getPrescriptions(req.params.babyId);
    res.status(200).json({ success: true, count: prescriptions.length, data: prescriptions });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all prescriptions
// @route   GET /api/prescriptions
// @access  Private (Admin)
const getAllPrescriptions = async (req, res, next) => {
  try {
    const prescriptions = await prescriptionService.getAllPrescriptions();
    res.status(200).json({ success: true, count: prescriptions.length, data: prescriptions });
  } catch (error) {
    next(error);
  }
};

// @desc    Update a prescription
// @route   PUT /api/prescriptions/:id
// @access  Private
const updatePrescription = async (req, res, next) => {
  try {
    const prescription = await prescriptionService.updatePrescription(req.params.id, req.body, req.file);
    res.status(200).json({ success: true, data: prescription });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a prescription
// @route   DELETE /api/prescriptions/:id
// @access  Private
const deletePrescription = async (req, res, next) => {
  try {
    await prescriptionService.deletePrescription(req.params.id);
    res.status(200).json({ success: true, data: {} });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  uploadPrescription,
  getPrescriptions,
  getAllPrescriptions,
  updatePrescription,
  deletePrescription
};

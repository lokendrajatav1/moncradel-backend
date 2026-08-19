const VaccinationMaster = require("./vaccinationMaster.model");

// @desc    Get all active master vaccines
// @route   GET /api/v1/vaccination-master
// @access  Public/Admin
exports.getAllMasterVaccines = async (req, res, next) => {
  try {
    const vaccines = await VaccinationMaster.find({ isActive: true }).sort({ dueMonths: 1 });
    res.status(200).json({ success: true, count: vaccines.length, data: vaccines });
  } catch (error) {
    next(error);
  }
};

// @desc    Create a new master vaccine
// @route   POST /api/v1/vaccination-master
// @access  Admin
exports.createMasterVaccine = async (req, res, next) => {
  try {
    const vaccine = await VaccinationMaster.create(req.body);
    res.status(201).json({ success: true, data: vaccine });
  } catch (error) {
    next(error);
  }
};

// @desc    Update a master vaccine
// @route   PUT /api/v1/vaccination-master/:id
// @access  Admin
exports.updateMasterVaccine = async (req, res, next) => {
  try {
    const vaccine = await VaccinationMaster.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!vaccine) {
      return res.status(404).json({ success: false, message: "Vaccine not found" });
    }
    res.status(200).json({ success: true, data: vaccine });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a master vaccine
// @route   DELETE /api/v1/vaccination-master/:id
// @access  Admin
exports.deleteMasterVaccine = async (req, res, next) => {
  try {
    const vaccine = await VaccinationMaster.findByIdAndDelete(req.params.id);
    if (!vaccine) {
      return res.status(404).json({ success: false, message: "Vaccine not found" });
    }
    res.status(200).json({ success: true, data: {} });
  } catch (error) {
    next(error);
  }
};



const babyService = require('./baby.service');

// @desc    Add a new baby
// @route   POST /api/babies
// @access  Private (Parents only)
const addBaby = async (req, res) => {
  try {
    // Ensure only parents can add babies
    if (req.user.role !== 'parent' && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Only parents can add a baby profile' });
    }

    let parentId = req.user._id || req.user.id;
    if (req.user.role === 'admin' && req.body.parentId) {
      parentId = req.body.parentId;
    }

    const baby = await babyService.addBaby(req.body, parentId);
    res.status(201).json({ success: true, data: baby });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get babies based on user role
// @route   GET /api/babies
// @access  Private
const getBabies = async (req, res) => {
  try {
    let babies = [];

    if (req.user.role === 'admin') {
      if (req.query.parentId) {
        babies = await babyService.getBabiesByParent(req.query.parentId);
      } else {
        babies = await babyService.getAllBabies();
      }
    } else if (req.user.role === 'doctor') {
      babies = await babyService.getBabiesByDoctor(req.user._id);
    } else if (req.user.role === 'parent') {
      babies = await babyService.getBabiesByParent(req.user._id);
    } else {
      return res.status(403).json({ success: false, message: 'Unauthorized to view babies' });
    }

    res.status(200).json({ success: true, count: babies.length, data: babies });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getBabyById = async (req, res) => {
  try {
    const baby = await babyService.getBabyById(req.params.id);
    if (!baby) {
      return res.status(404).json({ success: false, message: 'Baby not found' });
    }
    // Authorization checks
    if (req.user.role === 'parent' && baby.parentId.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Unauthorized to view this baby' });
    }
    if (req.user.role === 'doctor' && baby.assignedDoctorId?.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Unauthorized: Baby not assigned to you' });
    }
    res.status(200).json({ success: true, data: baby });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const updateBaby = async (req, res) => {
  try {
    const baby = await babyService.getBabyById(req.params.id);
    if (!baby) {
      return res.status(404).json({ success: false, message: 'Baby not found' });
    }

    // Auth check
    if (req.user.role !== 'admin' && req.user.role !== 'parent') {
      return res.status(403).json({ success: false, message: 'Unauthorized to update this baby' });
    }

    const updatedBaby = await babyService.updateBaby(req.params.id, req.body);
    res.status(200).json({ success: true, data: updatedBaby });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  addBaby,
  getBabies,
  getBabyById,
  updateBaby
};

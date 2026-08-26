const Attendance = require('./attendance.model');
const Staff = require('../staff/staff.model');

// @desc    Punch In for the day
// @route   POST /api/attendance/punch-in
// @access  Private (Kitchen Staff only)
const punchIn = async (req, res) => {
  try {
    const userId = req.user.id;
    
    // Find the staff profile for this user
    const staffProfile = await Staff.findOne({ user: userId });
    if (!staffProfile) {
      return res.status(404).json({ success: false, message: 'Staff profile not found' });
    }

    const today = new Date();
    const dateString = today.toISOString().split('T')[0]; // 'YYYY-MM-DD'

    // Check if already punched in today
    let attendance = await Attendance.findOne({ staffId: staffProfile._id, date: dateString });
    if (attendance) {
      return res.status(400).json({ success: false, message: 'Already punched in for today' });
    }

    attendance = await Attendance.create({
      staffId: staffProfile._id,
      userId: userId,
      kitchenId: staffProfile.kitchenId,
      date: dateString,
      punchInTime: new Date(),
      status: 'Present' // Could enhance to calculate Late based on shift time
    });

    res.status(201).json({ success: true, data: attendance, message: 'Successfully punched in' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Punch Out for the day
// @route   POST /api/attendance/punch-out
// @access  Private (Kitchen Staff only)
const punchOut = async (req, res) => {
  try {
    const userId = req.user.id;
    
    const staffProfile = await Staff.findOne({ user: userId });
    if (!staffProfile) {
      return res.status(404).json({ success: false, message: 'Staff profile not found' });
    }

    const today = new Date();
    const dateString = today.toISOString().split('T')[0];

    const attendance = await Attendance.findOne({ staffId: staffProfile._id, date: dateString });
    
    if (!attendance) {
      return res.status(400).json({ success: false, message: 'No punch-in record found for today' });
    }

    if (attendance.punchOutTime) {
      return res.status(400).json({ success: false, message: 'Already punched out for today' });
    }

    attendance.punchOutTime = new Date();
    
    // Calculate total hours
    const diffMs = attendance.punchOutTime - attendance.punchInTime;
    const diffHrs = diffMs / (1000 * 60 * 60);
    attendance.totalHoursWorked = parseFloat(diffHrs.toFixed(2));

    await attendance.save();

    res.status(200).json({ success: true, data: attendance, message: 'Successfully punched out' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get my own attendance history
// @route   GET /api/attendance/me
// @access  Private (Kitchen Staff only)
const getMyAttendance = async (req, res) => {
  try {
    const userId = req.user.id;
    
    const attendances = await Attendance.find({ userId: userId }).sort({ date: -1 });
    
    res.status(200).json({ success: true, count: attendances.length, data: attendances });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get attendance for the whole kitchen (for Admin)
// @route   GET /api/attendance
// @access  Private (Kitchen Admin only)
const getKitchenAttendance = async (req, res) => {
  try {
    const kitchenId = req.user.id;
    const dateString = req.query.date || new Date().toISOString().split('T')[0];

    const attendances = await Attendance.find({ kitchenId, date: dateString })
      .populate('userId', 'name email phone avatar')
      .populate('staffId', 'designation shift');

    res.status(200).json({ success: true, count: attendances.length, data: attendances });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update attendance manually (Admin Override)
// @route   PUT /api/attendance/:id
// @access  Private (Kitchen Admin only)
const updateAttendance = async (req, res) => {
  try {
    let attendance = await Attendance.findById(req.params.id);
    if (!attendance) {
      return res.status(404).json({ success: false, message: 'Attendance record not found' });
    }

    if (attendance.kitchenId.toString() !== req.user.id) {
      return res.status(401).json({ success: false, message: 'Not authorized to update this record' });
    }

    attendance = await Attendance.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    res.status(200).json({ success: true, data: attendance });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  punchIn,
  punchOut,
  getMyAttendance,
  getKitchenAttendance,
  updateAttendance
};

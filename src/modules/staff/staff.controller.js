const User = require('../user/user.model');
const Staff = require('./staff.model');
const bcrypt = require('bcryptjs');
const { uploadToCloudinary } = require('../../utils/cloudinary');

// @desc    Add a new staff member
// @route   POST /api/staff
// @access  Private (Kitchen Only)
const addStaff = async (req, res) => {
  try {
    const { name, phone, email, password, role, shift, station, joiningDate, certifications, status } = req.body;
    
    if (!password) {
      return res.status(400).json({ success: false, message: 'Password is required for new staff' });
    }
    
    if (!email) {
      return res.status(400).json({ success: false, message: 'Email is required for staff login' });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    let avatar = '';
    if (req.file) {
       const uploadResult = await uploadToCloudinary(req.file.buffer, 'staff');
       avatar = uploadResult.secure_url;
    }

    // 1. Create User for Auth
    const userData = {
      name,
      phone,
      email: email || undefined,
      password: hashedPassword,
      role: 'kitchen_staff',
      avatar: avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200'
    };

    const newUser = await User.create(userData);

    // Parse certifications
    let parsedCertifications = [];
    if (certifications) {
      if (typeof certifications === 'string') {
        parsedCertifications = certifications.split(',').map(c => c.trim()).filter(Boolean);
      } else if (Array.isArray(certifications)) {
        parsedCertifications = certifications;
      }
    }

    // 2. Create Staff Profile
    const staffData = {
      user: newUser._id,
      kitchenId: req.user.id,
      shift,
      station: station || 'TBD',
      designation: role,
      joiningDate,
      status: status || 'On-Duty'
    };

    const newStaff = await Staff.create(staffData);

    // Merge for response to match frontend expectations
    const responseData = {
      ...newUser.toObject(),
      ...newStaff.toObject(),
      _id: newUser._id // Keep User ID as primary ID for frontend compatibility
    };

    res.status(201).json({ success: true, data: responseData });
  } catch (error) {
    if (error.code === 11000) {
        return res.status(400).json({ success: false, message: 'Phone or email already exists' });
    }
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get all staff for current kitchen
// @route   GET /api/staff
// @access  Private (Kitchen Only)
const getStaff = async (req, res) => {
  try {
    // 1. Fetch all staff profiles for the current kitchen
    const staffProfiles = await Staff.find({ kitchenId: req.user.id }).lean();
    const staffUserIds = staffProfiles.map(p => p.user.toString());

    // 2. Fetch all legacy users who might still have kitchenId directly on them
    const allStaffUsers = await User.find({ role: 'kitchen_staff' }).lean();
    const legacyUsers = allStaffUsers.filter(u => 
        u.kitchenId && 
        u.kitchenId.toString() === req.user.id.toString() &&
        !staffUserIds.includes(u._id.toString())
    );

    // 3. Auto-migrate legacy users by creating a Staff profile for them
    for (let u of legacyUsers) {
        const profile = await Staff.create({
            user: u._id,
            kitchenId: req.user.id,
            shift: u.shift || 'Morning Shift',
            station: u.station || 'TBD',
            designation: u.designation || 'Chef',
            joiningDate: u.joiningDate || new Date(),
            status: u.status || 'On-Duty'
        });
        staffProfiles.push(profile.toObject());
        staffUserIds.push(u._id.toString());
    }

    // 4. Fetch the User documents for all staff profiles
    const users = await User.find({ _id: { $in: staffUserIds } }).lean();
    const userMap = {};
    users.forEach(u => userMap[u._id.toString()] = u);

    // 5. Combine data for frontend
    const formattedStaff = staffProfiles.map(p => {
        const u = userMap[p.user.toString()];
        return {
            ...p,
            name: u ? u.name : 'Unknown',
            email: u ? u.email : '',
            phone: u ? u.phone : '',
            avatar: u ? u.avatar : '',
            _id: u ? u._id : p.user, // Important: Frontend expects User ID as _id
            staffProfileId: p._id
        };
    });

    res.status(200).json({ success: true, data: formattedStaff });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update staff
// @route   PUT /api/staff/:id
// @access  Private (Kitchen Only)
const updateStaff = async (req, res) => {
  try {
    const updateData = { ...req.body };
    const userId = req.params.id; // Frontend sends the User ID

    // 1. Prepare User Core Updates
    const userUpdates = {};
    if (updateData.name) userUpdates.name = updateData.name;
    if (updateData.email) userUpdates.email = updateData.email;
    if (updateData.phone) userUpdates.phone = updateData.phone;
    
    if (req.file) {
       const uploadResult = await uploadToCloudinary(req.file.buffer, 'staff');
       userUpdates.avatar = uploadResult.secure_url;
    }

    if (updateData.password) {
        const salt = await bcrypt.genSalt(10);
        userUpdates.password = await bcrypt.hash(updateData.password, salt);
    }

    // 2. Prepare Staff Profile Updates
    const staffUpdates = {};
    if (updateData.role) staffUpdates.designation = updateData.role;
    if (updateData.shift) staffUpdates.shift = updateData.shift;
    if (req.body.station !== undefined) staffUpdates.station = req.body.station;
    if (req.body.joiningDate !== undefined) staffUpdates.joiningDate = req.body.joiningDate;
    if (req.body.status !== undefined) staffUpdates.status = req.body.status;

    // Execute Updates
    let updatedUser;
    if (Object.keys(userUpdates).length > 0) {
      updatedUser = await User.findByIdAndUpdate(
        userId,
        userUpdates,
        { new: true, runValidators: true }
      );
      if (!updatedUser) {
        return res.status(404).json({ success: false, message: 'User not found' });
      }
    }

    let updatedStaff;
    if (Object.keys(staffUpdates).length > 0) {
      updatedStaff = await Staff.findOneAndUpdate(
        { user: userId, kitchenId: req.user.id },
        staffUpdates,
        { new: true, runValidators: true }
      );
    } else {
      updatedStaff = await Staff.findOne({ user: userId, kitchenId: req.user.id });
    }

    // Merge for response
    const responseData = {
      ...(updatedStaff ? updatedStaff.toObject() : {}),
      name: updatedUser ? updatedUser.name : undefined,
      email: updatedUser ? updatedUser.email : undefined,
      phone: updatedUser ? updatedUser.phone : undefined,
      avatar: updatedUser ? updatedUser.avatar : undefined,
      _id: userId
    };

    res.status(200).json({ success: true, data: responseData });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete staff
// @route   DELETE /api/staff/:id
// @access  Private (Kitchen Only)
const deleteStaff = async (req, res) => {
  try {
    const userId = req.params.id; // Frontend sends the User ID

    // Ensure the user actually belongs to this kitchen before deleting
    const user = await User.findOne({ _id: userId, role: 'kitchen_staff' });
    
    if (!user) {
      return res.status(404).json({ success: false, message: 'Staff member not found' });
    }

    // Delete the Staff profile
    await Staff.findOneAndDelete({ user: userId, kitchenId: req.user.id });
    
    // Delete the actual User account (preventing login)
    await User.findByIdAndDelete(userId);

    res.status(200).json({ success: true, message: 'Staff member deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  addStaff,
  getStaff,
  updateStaff,
  deleteStaff
};
 
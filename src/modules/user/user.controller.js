const userService = require('./user.service');
const User = require('./user.model');
const Customer = require('../customer/customer.model');
const Doctor = require('../doctor/doctor.model');
const DeliveryPartner = require('../deliveryPartner/deliveryPartner.model');
const KitchenPartner = require('../kitchenPartner/kitchenPartner.model');
const { uploadToCloudinary } = require('../../utils/cloudinary');

const getModelByRole = (role) => {
  switch (role) {
    case 'parent': return Customer;
    case 'doctor': return Doctor;
    case 'delivery': return DeliveryPartner;
    case 'kitchen': return KitchenPartner;
    default: return null;
  }
};

// @desc    Get user profile data
// @route   GET /api/users/profile
// @access  Private
const getUserProfile = async (req, res) => {
  try {
    const Model = getModelByRole(req.user.role);
    let profileData = null;
    if (Model) {
      profileData = await Model.findOne({ user: req.user._id });
    }
    res.status(200).json({
      success: true,
      user: req.user,
      profile: profileData
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update user profile data
// @route   PUT /api/users/profile
// @access  Private
const updateUserProfile = async (req, res) => {
  try {
    // Update base user fields
    const baseUpdates = {};
    if (req.body.name) baseUpdates.name = req.body.name;
    if (req.body.email) baseUpdates.email = req.body.email;
    if (req.body.phone) baseUpdates.phone = req.body.phone;
    if (req.body.address) baseUpdates.address = req.body.address;

    if (req.file) {
      const result = await uploadToCloudinary(req.file.buffer, 'avatars');
      baseUpdates.avatar = result.secure_url;
    }

    if (Object.keys(baseUpdates).length > 0) {
      await User.findByIdAndUpdate(req.user._id, baseUpdates, { runValidators: true });
      if (baseUpdates.name) req.user.name = baseUpdates.name;
      if (baseUpdates.email) req.user.email = baseUpdates.email;
      if (baseUpdates.phone) req.user.phone = baseUpdates.phone;
      if (baseUpdates.avatar) req.user.avatar = baseUpdates.avatar;
      if (baseUpdates.address) req.user.address = baseUpdates.address;
    }

    // Update specific profile fields
    const Model = getModelByRole(req.user.role);
    let profileData = null;
    if (Model) {
      profileData = await Model.findOne({ user: req.user._id });
      if (!profileData) {
        profileData = new Model({ user: req.user._id });
      }
      
      // Prevent updating system fields
      const updateData = { ...req.body };
      delete updateData.user;
      delete updateData.role;
      delete updateData._id;
      delete updateData.name;
      delete updateData.email;
      delete updateData.phone;

      Object.assign(profileData, updateData);
      await profileData.save();
    }

    res.status(200).json({
      success: true,
      user: req.user,
      profile: profileData
    });
  } catch (error) {
    if (error.code === 11000) {
      const field = Object.keys(error.keyValue)[0];
      return res.status(400).json({ 
        success: false, 
        message: `${field.charAt(0).toUpperCase() + field.substring(1)} already exists. Please use a different ${field}.` 
      });
    }
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get all users
// @route   GET /api/users
// @access  Public (temporarily for testing)
const getAllUsers = async (req, res) => {
  try {
    const query = { ...req.query };
    
    // Handle verificationStatus filtering
    if (query.verificationStatus) {
      const { verificationStatus } = query;
      delete query.verificationStatus;
      
      let profileQuery = { verificationStatus };
      if (verificationStatus === 'pending') {
        profileQuery = { $or: [{ verificationStatus: 'pending' }, { verificationStatus: { $exists: false } }] };
      }
      
      const [doctors, kitchens, deliveries] = await Promise.all([
        require('../doctor/doctor.model').find(profileQuery).select('user'),
        require('../kitchenPartner/kitchenPartner.model').find(profileQuery).select('user'),
        require('../deliveryPartner/deliveryPartner.model').find(profileQuery).select('user')
      ]);
      
      const userIds = [
        ...doctors.map(d => d.user),
        ...kitchens.map(k => k.user),
        ...deliveries.map(d => d.user)
      ];
      
      query._id = { in: userIds };
    }

    const { users: userDocs, totalCount } = await userService.getAllUsers(query);
    const users = await Promise.all(userDocs.map(async (userDoc) => {
      const user = userDoc.toObject ? userDoc.toObject() : userDoc;
      let profileData = null;
      if (user.role === 'customer' || user.role === 'parent') profileData = await Customer.findOne({ user: user._id }).select('verificationStatus');
      else if (user.role === 'doctor') profileData = await Doctor.findOne({ user: user._id }).select('verificationStatus');
      else if (user.role === 'delivery') profileData = await DeliveryPartner.findOne({ user: user._id }).select('verificationStatus');
      else if (user.role === 'kitchen') profileData = await KitchenPartner.findOne({ user: user._id }).select('verificationStatus');
      
      user.verificationStatus = profileData?.verificationStatus || 'N/A';
      return user;
    }));
    
    res.status(200).json({ success: true, count: totalCount, data: users });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get user by ID
// @route   GET /api/users/:id
// @access  Public (temporarily for testing)
const getUser = async (req, res) => {
  try {
    const userDoc = await User.findById(req.params.id).select('-password');
    if (!userDoc) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    const user = userDoc.toObject();
    
    // We need to get the model
    let profileData = null;
    if (user.role === 'customer' || user.role === 'parent') profileData = await require('../customer/customer.model').findOne({ user: user._id });
    else if (user.role === 'doctor') profileData = await require('../doctor/doctor.model').findOne({ user: user._id });
    else if (user.role === 'delivery') profileData = await require('../deliveryPartner/deliveryPartner.model').findOne({ user: user._id });
    else if (user.role === 'kitchen') profileData = await require('../kitchenPartner/kitchenPartner.model').findOne({ user: user._id });

    if (profileData) {
      user.profile = profileData;
    }

    res.status(200).json({ success: true, data: user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete user
// @route   DELETE /api/users/:id
// @access  Public (temporarily for testing)
const deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    res.status(200).json({ success: true, message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update user
// @route   PUT /api/users/:id
// @access  Public (temporarily for testing)
const updateUser = async (req, res) => {
  try {
    const updateData = { ...req.body };
    
    // Handle avatar upload if present
    if (req.file) {
      const result = await uploadToCloudinary(req.file.buffer, 'avatars');
      updateData.avatar = result.secure_url;
    }

    const user = await User.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
      runValidators: true
    }).select('-password');
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    res.status(200).json({ success: true, data: user });
  } catch (error) {
    if (error.code === 11000) {
      const field = Object.keys(error.keyValue)[0];
      return res.status(400).json({ 
        success: false, 
        message: `${field.charAt(0).toUpperCase() + field.substring(1)} already exists. Please use a different ${field}.` 
      });
    }
    res.status(500).json({ success: false, message: error.message });
  }
};
const verifyUser = async (req, res) => {
  try {
    const { status, reason } = req.body;
    if (!['approved', 'rejected'].includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid status' });
    }

    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    const Model = getModelByRole(user.role);
    if (!Model) return res.status(400).json({ success: false, message: 'This role does not require verification' });

    let profile = await Model.findOne({ user: user._id });
    if (!profile) {
      profile = new Model({ user: user._id });
    }

    profile.verificationStatus = status;
    if (status === 'rejected') {
      profile.rejectionReason = reason || 'No reason provided';
      user.isActive = false; // Block login if rejected
    } else if (status === 'approved') {
      profile.rejectionReason = '';
      user.isActive = true; // Allow login if approved
    }

    await profile.save();
    await user.save();

    res.json({ success: true, message: `User profile ${status} successfully`, data: profile });
  } catch (error) {
    console.error('Error verifying user:', error);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

// @desc    Admin create user (bypasses OTP verification)
// @route   POST /api/users/register
// @access  Admin
const createUserByAdmin = async (req, res) => {
  try {
    const { name, email, password, role, phone } = req.body;
    
    const userExists = await User.findOne({ email });
    if (userExists) return res.status(400).json({ success: false, message: 'User with this email already exists' });
    
    const phoneExists = await User.findOne({ phone });
    if (phoneExists) return res.status(400).json({ success: false, message: 'User with this phone number already exists' });

    const bcrypt = require('bcryptjs');
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role,
      phone
    });

    res.status(201).json({ success: true, data: { _id: user._id, name: user.name, email: user.email, role: user.role } });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getUserProfile,
  updateUserProfile,
  getAllUsers,
  getUser,
  deleteUser,
  updateUser,
  verifyUser,
  createUserByAdmin
};

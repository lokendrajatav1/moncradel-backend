const express = require('express');
const router = express.Router();
const { getUserProfile, updateUserProfile, getAllUsers, getUser, deleteUser, updateUser, verifyUser } = require('./user.controller');
const { protect } = require('../../middleware/auth');
const validate = require('../../middleware/validate');
const { updateProfileSchema } = require('./user.validation');
const upload = require('../../middleware/upload');

const { registerUser } = require('../auth/auth.controller');
const { registerSchema } = require('../auth/auth.validation');

router.get('/profile', protect, getUserProfile);
router.put('/profile', protect, upload.single('avatar'), validate(updateProfileSchema), updateUserProfile);

// Admin Routes (temporarily unprotected)
router.post('/register', validate(registerSchema), registerUser);
router.get('/', getAllUsers);
router.get('/:id', getUser);
router.put('/:id/verify', verifyUser);
router.put('/:id', upload.single('avatar'), updateUser);
router.delete('/:id', deleteUser);

module.exports = router;

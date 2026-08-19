const express = require('express');
const router = express.Router();
const { getUserProfile, updateUserProfile, getAllUsers, getUser, deleteUser, updateUser, verifyUser, createUserByAdmin, getWishlist, addToWishlist, removeFromWishlist } = require('./user.controller');
const { protect } = require('../../middleware/auth');
const validate = require('../../middleware/validate');
const { updateProfileSchema } = require('./user.validation');
const upload = require('../../middleware/upload');

const { registerSchema } = require('../auth/auth.validation');

router.get('/profile', protect, getUserProfile);
router.put('/profile', protect, upload.single('avatar'), validate(updateProfileSchema), updateUserProfile);

router.get('/wishlist', protect, getWishlist);
router.post('/wishlist', protect, addToWishlist);
router.delete('/wishlist/:itemId', protect, removeFromWishlist);

// Admin Routes (temporarily unprotected)
// Admin doesn't need to provide OTP to create users
const adminRegisterSchema = registerSchema.omit({ otp: true });
router.post('/register', validate(adminRegisterSchema), createUserByAdmin);
router.get('/', getAllUsers);
router.get('/:id', getUser);
router.put('/:id/verify', verifyUser);
router.put('/:id', upload.single('avatar'), updateUser);
router.delete('/:id', deleteUser);

module.exports = router;

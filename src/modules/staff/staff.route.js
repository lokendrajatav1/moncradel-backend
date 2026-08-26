const express = require('express');
const { addStaff, getStaff, updateStaff, deleteStaff } = require('./staff.controller');
const { protect, authorize } = require('../../middleware/auth');
const upload = require('../../middleware/upload');

const router = express.Router();

// All staff management routes are protected and restricted to kitchen owners
router.use(protect);
router.use(authorize('kitchen'));

router
  .route('/')
  .post(upload.single('photo'), addStaff)
  .get(getStaff);

router
  .route('/:id')
  .put(upload.single('photo'), updateStaff)
  .delete(deleteStaff);

module.exports = router;

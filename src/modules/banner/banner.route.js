const express = require('express');
const router = express.Router();
const { createBanner, getBanners, updateBanner, deleteBanner } = require('./banner.controller');
const { protect } = require('../../middleware/auth');
const upload = require('../../middleware/upload');

// Temporarily unprotected for admin panel testing
router.route('/')
  .post(upload.single('image'), createBanner)
  .get(getBanners);

router.route('/:id')
  .put(upload.single('image'), updateBanner)
  .delete(deleteBanner);

module.exports = router;

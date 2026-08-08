const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../../middleware/auth');

const { addBaby, getBabies, getBabyById, updateBaby } = require('./baby.controller');
const validate = require('../../middleware/validate');
const { addBabySchema, updateBabySchema } = require('./baby.validation');

router.route('/')
  .post(protect, validate(addBabySchema), addBaby)
  .get(protect, getBabies);

router.route('/:id')
  .get(protect, getBabyById)
  .put(protect, validate(updateBabySchema), updateBaby);

module.exports = router;

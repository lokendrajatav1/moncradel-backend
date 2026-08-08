const express = require('express');
const router = express.Router();
const { uploadPrescription, getPrescriptions, getAllPrescriptions, updatePrescription, deletePrescription } = require('./prescription.controller');
const { protect } = require('../../middleware/auth');
const upload = require('../../middleware/upload');
const validate = require('../../middleware/validate');
const { uploadPrescriptionSchema } = require('./prescription.validation');

router.route('/')
  .post(protect, upload.single('file'), validate(uploadPrescriptionSchema), uploadPrescription)
  .get(protect, getAllPrescriptions);

router.route('/:babyId')
  .get(protect, getPrescriptions);

router.route('/:id')
  .put(protect, upload.single('file'), updatePrescription)
  .delete(protect, deletePrescription);

module.exports = router;

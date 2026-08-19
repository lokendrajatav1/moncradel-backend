const express = require('express');
const { getVaccinations, getBabyVaccinationSchedule, upsertVaccination } = require('./vaccination.controller');
const { protect } = require('../../middleware/auth');

const router = express.Router({ mergeParams: true });

router.use(protect);

router.get('/:babyId/schedule', getBabyVaccinationSchedule);

router
  .route('/:babyId')
  .get(getVaccinations)
  .post(upsertVaccination);

module.exports = router;

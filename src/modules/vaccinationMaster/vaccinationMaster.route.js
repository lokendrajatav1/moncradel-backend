const express = require('express');
const {
  getAllMasterVaccines,
  createMasterVaccine,
  updateMasterVaccine,
  deleteMasterVaccine
} = require('./vaccinationMaster.controller');

const router = express.Router();

router
  .route('/')
  .get(getAllMasterVaccines)
  .post(createMasterVaccine);



router
  .route('/:id')
  .put(updateMasterVaccine)
  .delete(deleteMasterVaccine);

module.exports = router;

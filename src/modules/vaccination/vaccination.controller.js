const vaccinationService = require('./vaccination.service');

/**
 * @desc    Get vaccinations for a baby
 * @route   GET /api/vaccinations/:babyId
 * @access  Private
 */
const getVaccinations = async (req, res, next) => {
  try {
    const { babyId } = req.params;

    if (!babyId) {
      return res.status(400).json({ success: false, message: 'Please provide a baby ID' });
    }

    const vaccinations = await vaccinationService.getVaccinationsByBabyId(babyId);

    res.status(200).json({
      success: true,
      count: vaccinations.length,
      data: vaccinations
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update or create a vaccination record
 * @route   POST /api/vaccinations/:babyId
 * @access  Private
 */
const upsertVaccination = async (req, res, next) => {
  try {
    const { babyId } = req.params;
    const { vaccineName, status, givenDate, administeredBy, notes, isCustom, customDescription, isSkipped, rescheduledDueDate } = req.body;

    if (!babyId) {
      return res.status(400).json({ success: false, message: 'Please provide a baby ID' });
    }
    if (!vaccineName) {
      return res.status(400).json({ success: false, message: 'Please provide a vaccine name' });
    }
    if (!status && isSkipped === undefined && rescheduledDueDate === undefined) {
      return res.status(400).json({ success: false, message: 'Please provide a vaccination status, skip, or reschedule' });
    }

    const record = await vaccinationService.upsertVaccination(babyId, {
      vaccineName,
      status,
      givenDate,
      administeredBy,
      notes,
      isCustom,
      customDescription,
      isSkipped,
      rescheduledDueDate
    });

    res.status(200).json({
      success: true,
      data: record
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get full computed vaccination schedule for a baby
 * @route   GET /api/vaccinations/:babyId/schedule
 * @access  Private
 */
const getBabyVaccinationSchedule = async (req, res, next) => {
  try {
    const { babyId } = req.params;

    if (!babyId) {
      return res.status(400).json({ success: false, message: 'Please provide a baby ID' });
    }

    const schedule = await vaccinationService.getVaccinationSchedule(babyId);

    res.status(200).json({
      success: true,
      count: schedule.length,
      data: schedule
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getVaccinations,
  getBabyVaccinationSchedule,
  upsertVaccination
};

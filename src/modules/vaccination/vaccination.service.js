const Vaccination = require('./vaccination.model');
const VaccinationMaster = require('../vaccinationMaster/vaccinationMaster.model');
const Baby = require('../baby/baby.model');

/**
 * Get all vaccinations for a baby
 */
const getVaccinationsByBabyId = async (babyId) => {
  return await Vaccination.find({ babyId }).lean();
};

/**
 * Get the full, computed vaccination schedule for a baby
 */
const getVaccinationSchedule = async (babyId) => {
  const baby = await Baby.findById(babyId);
  if (!baby) throw new Error('Baby not found');

  const masterVaccines = await VaccinationMaster.find({ isActive: true }).lean();
  const babyRecords = await Vaccination.find({ babyId }).lean();

  const recordsMap = {};
  babyRecords.forEach(r => recordsMap[r.vaccineName] = r);

  const schedule = [];

  // 1. Process master vaccines
  masterVaccines.forEach(mv => {
    schedule.push(computeVaccineStatus(mv, recordsMap[mv.name], baby));
  });

  // 2. Process custom vaccines not in master
  babyRecords.forEach(r => {
    if (r.isCustom && !masterVaccines.find(mv => mv.name === r.vaccineName)) {
      schedule.push(computeVaccineStatus({
        name: r.vaccineName,
        dueMonths: 0, // Custom vaccines don't have a standard due month unless specified
        dueAgeLabel: 'Custom',
        description: r.customDescription || ''
      }, r, baby));
    }
  });

  // Sort by dueMonths
  schedule.sort((a, b) => a.dueMonths - b.dueMonths);

  return schedule;
};

/**
 * Helper to compute precise status
 */
function computeVaccineStatus(masterTemplate, record, baby) {
  const item = {
    ...masterTemplate,
    record: record || null,
    computedStatus: 'future'
  };

  if (record?.status === 'given') {
    item.computedStatus = 'given';
    return item;
  }
  if (record?.status === 'missed') {
    item.computedStatus = 'missed';
    return item;
  }
  if (record?.isSkipped) {
    item.computedStatus = 'skipped';
    return item;
  }

  let targetDate = new Date();
  if (baby.dateOfBirth) {
    targetDate = new Date(baby.dateOfBirth);
    targetDate.setDate(targetDate.getDate() + Math.round((masterTemplate.dueMonths || 0) * 30.4375));
  } else {
    targetDate.setMonth(targetDate.getMonth() - (baby.ageInMonths || 0) + (masterTemplate.dueMonths || 0));
  }

  if (record?.rescheduledDueDate) {
    targetDate = new Date(record.rescheduledDueDate);
  }

  const now = new Date();
  const oneMonthAgo = new Date();
  oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
  const oneMonthFromNow = new Date();
  oneMonthFromNow.setMonth(oneMonthFromNow.getMonth() + 1);

  const isOverdue = oneMonthAgo >= targetDate;
  const isDue = now >= targetDate && !isOverdue;
  const isUpcoming = oneMonthFromNow >= targetDate && now < targetDate;

  let baseStatus = 'future';
  if (isOverdue) baseStatus = 'overdue';
  else if (isDue) baseStatus = 'due';
  else if (isUpcoming) baseStatus = 'upcoming';

  item.computedStatus = record?.rescheduledDueDate ? `rescheduled_${baseStatus}` : baseStatus;
  return item;
}

/**
 * Update or Create a vaccination record
 */
const upsertVaccination = async (babyId, vaccineData) => {
  const { vaccineName, status, givenDate, administeredBy, notes, isCustom, customDescription, isSkipped, rescheduledDueDate } = vaccineData;
  
  // Build the update object dynamically so we don't overwrite existing fields with undefined
  const updateData = {};
  if (status !== undefined) updateData.status = status;
  if (givenDate !== undefined) updateData.givenDate = givenDate;
  if (status === 'given' && !givenDate) updateData.givenDate = new Date();
  if (administeredBy !== undefined) updateData.administeredBy = administeredBy;
  if (notes !== undefined) updateData.notes = notes;
  if (isCustom !== undefined) updateData.isCustom = isCustom;
  if (customDescription !== undefined) updateData.customDescription = customDescription;
  if (isSkipped !== undefined) updateData.isSkipped = isSkipped;
  if (rescheduledDueDate !== undefined) updateData.rescheduledDueDate = rescheduledDueDate;

  // Find existing record and update, or create a new one
  const record = await Vaccination.findOneAndUpdate(
    { babyId, vaccineName },
    { $set: updateData },
    { new: true, upsert: true, runValidators: true }
  );

  return record;
};

module.exports = {
  getVaccinationsByBabyId,
  getVaccinationSchedule,
  upsertVaccination
};

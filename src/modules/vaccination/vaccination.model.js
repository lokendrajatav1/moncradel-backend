const mongoose = require('mongoose');

const vaccinationSchema = new mongoose.Schema({
  babyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Baby',
    required: [true, 'Baby ID is required']
  },
  vaccineName: {
    type: String,
    required: [true, 'Vaccine name is required']
  },
  status: {
    type: String,
    enum: ['pending', 'given', 'missed'],
    default: 'pending'
  },
  givenDate: {
    type: Date
  },
  administeredBy: {
    type: String // Name of the doctor or hospital
  },
  notes: {
    type: String
  },
  isCustom: {
    type: Boolean,
    default: false
  },
  customDescription: {
    type: String
  },
  isSkipped: {
    type: Boolean,
    default: false
  },
  rescheduledDueDate: {
    type: Date
  }
}, {
  timestamps: true
});

// Ensure a baby has only one record per vaccine name
vaccinationSchema.index({ babyId: 1, vaccineName: 1 }, { unique: true });

const Vaccination = mongoose.model('Vaccination', vaccinationSchema);

module.exports = Vaccination;

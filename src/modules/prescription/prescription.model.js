const mongoose = require('mongoose');

const prescriptionSchema = new mongoose.Schema({
  babyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Baby',
    required: true
  },
  doctorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: false // Not required when parent uploads their own report
  },
  uploadedByParent: {
    type: Boolean,
    default: false
  },
  fileUrl: {
    type: String, // Cloudinary URL
    default: ''
  },
  medicalNotes: {
    type: String,
    default: ''
  },
  nutritionRecommendations: {
    type: String,
    default: ''
  },
  medicines: [{
    name: { type: String, required: true },
    dosage: { type: String, required: true },
    frequency: { type: String }, // e.g., '1-0-1'
    duration: { type: String }, // e.g., '5 Days'
    instructions: { type: String } // e.g., 'After meal'
  }],
  vitals: {
    weight: { type: String }, // e.g., '8.5 kg'
    temperature: { type: String }, // e.g., '98.6 F'
    bp: { type: String } // e.g., '120/80'
  },
  nextVisitDate: {
    type: Date
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Prescription', prescriptionSchema);

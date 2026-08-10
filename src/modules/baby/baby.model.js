const mongoose = require('mongoose');

const babySchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add the baby\'s name'],
    trim: true
  },
  gender: {
    type: String,
    enum: {
      values: ['boy', 'girl', 'private'],
      message: '{VALUE} is not a valid gender'
    },
    lowercase: true,
    required: [true, 'Please specify the baby\'s gender']
  },
  dateOfBirth: {
    type: Date,
    required: [true, 'Please add the baby\'s date of birth']
  },
  ageInMonths: {
    type: Number
  },
  prematureDays: {
    type: Number,
    default: 0,
    min: [0, 'Premature days cannot be negative']
  },
  weight: {
    type: Number,
    min: [0, 'Weight cannot be negative']
  },
  height: {
    type: Number,
    min: [0, 'Height cannot be negative']
  },
  medicalCondition: {
    type: String,
    trim: true
  },
  diet: {
    type: String,
    trim: true
  },
  bloodType: {
    type: String,
    enum: {
      values: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'],
      message: '{VALUE} is not a valid blood type'
    },
    trim: true
  },
  allergies: {
    type: [String],
    default: []
  },
  parentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  assignedDoctorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  isActive: {
    type: Boolean,
    default: true
  },
  avatar: {
    type: String
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Baby', babySchema);

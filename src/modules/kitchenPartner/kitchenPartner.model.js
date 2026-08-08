const mongoose = require('mongoose');

const kitchenPartnerSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true
    },
    kitchenName: {
      type: String
    },
    fssaiLicenseNumber: {
      type: String
    },
    ownerName: {
      type: String
    },
    address: {
      type: String
    },
    preparationCapacityPerDay: {
      type: Number
    },
    isOpen: {
      type: Boolean,
      default: false
    },
    gstNumber: {
      type: String
    },
    bankDetails: {
      accountName: { type: String },
      accountNumber: { type: String },
      ifscCode: { type: String },
      bankName: { type: String }
    },
    location: {
      type: { type: String, enum: ['Point'], default: 'Point' },
      coordinates: { type: [Number], default: [0, 0] } // [longitude, latitude]
    },
    operatingHours: {
      openTime: { type: String },
      closeTime: { type: String }
    },
    rating: {
      type: Number,
      default: 0
    },
    verificationStatus: {
      type: String,
      enum: ['pending', 'approved', 'rejected'],
      default: 'pending'
    },
    rejectionReason: {
      type: String,
      default: ''
    },
    cuisineTypes: {
      type: [String],
      default: []
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('KitchenPartner', kitchenPartnerSchema);

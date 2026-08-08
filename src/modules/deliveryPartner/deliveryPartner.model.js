const mongoose = require('mongoose');

const deliveryPartnerSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true
    },
    vehicleType: {
      type: String
    },
    vehicleNumber: {
      type: String
    },
    drivingLicenseNumber: {
      type: String
    },
    aadharNumber: {
      type: String
    },
    currentLocation: {
      type: {
        type: String,
        enum: ['Point'],
        default: 'Point'
      },
      coordinates: {
        type: [Number],
        default: [0, 0] // [longitude, latitude]
      }
    },
    isOnline: {
      type: Boolean,
      default: false
    },
    isActive: {
      type: Boolean,
      default: false // Requires admin approval
    },
    insuranceExpiryDate: {
      type: Date
    },
    bankDetails: {
      accountName: { type: String },
      accountNumber: { type: String },
      ifscCode: { type: String },
      bankName: { type: String }
    },
    emergencyContact: {
      name: { type: String },
      relation: { type: String },
      phone: { type: String }
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
    }
  },
  {
    timestamps: true
  }
);

// Create a 2dsphere index on currentLocation for geospatial queries
deliveryPartnerSchema.index({ currentLocation: '2dsphere' });

module.exports = mongoose.model('DeliveryPartner', deliveryPartnerSchema);

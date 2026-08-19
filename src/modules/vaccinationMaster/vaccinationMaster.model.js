const mongoose = require("mongoose");

const vaccinationMasterSchema = new mongoose.Schema(
  {
    name: { 
      type: String, 
      required: [true, 'Please add a vaccine name'], 
      unique: true 
    },
    dueMonths: { 
      type: Number, 
      required: [true, 'Please specify the due months (e.g., 0 for At Birth, 1.5 for 6 Weeks)'] 
    },
    dueAgeLabel: {
      type: String,
      required: [true, 'Please specify the display label for the due age (e.g. "At Birth", "6 Weeks")']
    },
    description: { 
      type: String 
    },
    isActive: { 
      type: Boolean, 
      default: true 
    }
  },
  { 
    timestamps: true 
  }
);

module.exports = mongoose.model("VaccinationMaster", vaccinationMasterSchema);

const mongoose = require("mongoose");

const candidateSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },

  party: { type: String, required: true, trim: true },

  partySymbol: { 
    type: String,   // *file path to uploaded symbol image*
    required: true 
  },

  photo: { 
    type: String,   // *file path to uploaded candidate photo*
    required: true 
  },

  votes: { type: Number, default: 0 },

  isActive: { type: Boolean, default: true }

}, { timestamps: true });

module.exports = mongoose.model("Candidate", candidateSchema);

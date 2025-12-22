const mongoose = require("mongoose");

const resumeSchema = new mongoose.Schema({
  originalName: String,
  savedName: String,
  atsScore: Number,
  suggestions: [String],
  uploadDate: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Resume", resumeSchema);

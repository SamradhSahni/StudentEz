const mongoose = require("mongoose");

const applicationSchema = new mongoose.Schema({
  job: { type: mongoose.Schema.Types.ObjectId, ref: "Job", required: true },
  applicant: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  resume: { type: String, required: true },
  name: { type: String, required: true },
  email: { type: String, required: true },
  contact: { type: String, required: true },
  status: { type: String, enum: ["Pending", "Accepted", "Declined"], default: "Pending" },
  note: { type: String },
  appliedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Application", applicationSchema);

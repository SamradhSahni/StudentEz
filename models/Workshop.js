const mongoose = require("mongoose");

const workshopSchema = new mongoose.Schema({
  title: String,
  instructor: String,
  date: String,
  time: String,
  description: String,
  location: String,
  imageUrl: String,
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User1" },
  enrolledUsers: [{ type: mongoose.Schema.Types.ObjectId, ref: "User1" }],
});

module.exports = mongoose.model("Workshop", workshopSchema);

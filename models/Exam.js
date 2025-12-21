const mongoose = require("mongoose");
const examSchema = new mongoose.Schema({
  subject: String,
  date: String,
  userId: mongoose.Schema.Types.ObjectId,
});
module.exports = mongoose.model("Exam", examSchema);

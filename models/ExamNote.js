const mongoose = require("mongoose");
const examNoteSchema = new mongoose.Schema({
  examId: mongoose.Schema.Types.ObjectId,
  title: String,
  content: String,
  type: String,
});
module.exports = mongoose.model("ExamNote", examNoteSchema);
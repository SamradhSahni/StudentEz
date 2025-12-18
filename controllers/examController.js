const Exam = require("../models/Exam");
const ExamNote = require("../models/ExamNote");

module.exports.getExams = async (req, res) => {
  const exams = await Exam.find({ userId: req.session.userId });
  res.render("exams/exampage", { exams });
};

module.exports.addExam = async (req, res) => {
  await Exam.create({ ...req.body, userId: req.session.userId });
  res.redirect("/exams");
};

module.exports.getExamDetails = async (req, res) => {
  const exam = await Exam.findById(req.params.id);
  const notes = await ExamNote.find({ examId: exam._id });
  res.render("exams/details", { exam, notes });
};

module.exports.addExamNote = async (req, res) => {
  await ExamNote.create({ ...req.body, examId: req.params.id });
  res.redirect(`/exams/details/${req.params.id}`);
};
module.exports.deleteExam = async (req, res) => {
  try {
    await Exam.deleteOne({ _id: req.params.id, userId: req.session.userId });
    await ExamNote.deleteMany({ examId: req.params.id }); // remove related notes
    res.redirect("/exams");
  } catch (error) {
    console.error("Error deleting exam:", error);
    res.status(500).send("Failed to delete exam");
  }
};



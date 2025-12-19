const Resume = require("../models/resumeModel");
const path = require("path");
const { analyzeResume } = require("../utils/resumeAnalyzer");

exports.showForm = (req, res) => {
  res.render("resume/resumeForm");
};

exports.uploadResume = async (req, res) => {
  try {
    const filePath = path.join(__dirname, "..", "public", "resumescreener", req.file.filename);
    const { score, suggestions, details, scoreLevel } = await analyzeResume(filePath,
  req.file.originalname);

    const resume = new Resume({
      originalName: req.file.originalname,
      savedName: req.file.filename,
      atsScore: score,
      suggestions
    });

    await resume.save();

    res.render("resume/resumeResult", { resume, details, scoreLevel });
  } catch (error) {
    console.error("Resume analysis failed:", error);
    res.status(500).send("Something went wrong while analyzing your resume.");
  }
};


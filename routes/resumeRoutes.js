const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const resumeController = require("../controllers/resumeController");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "..", "public", "resumescreener"));
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const fileName = `resume_${Date.now()}${ext}`;
    cb(null, fileName);
  }
});

const upload = multer({ storage });

router.get("/resume/screener", resumeController.showForm);
router.post("/resume/screener", upload.single("resume"), resumeController.uploadResume);

module.exports = router;

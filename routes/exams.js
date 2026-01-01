const express = require("express");
const router = express.Router();
const examController = require("../controllers/examController");

router.get("/", examController.getExams);
router.post("/add", examController.addExam);
router.get("/details/:id", examController.getExamDetails);
router.post("/details/:id/add-note", examController.addExamNote);
router.get("/delete/:id", examController.deleteExam);


module.exports = router;

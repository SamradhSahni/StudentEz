const express = require("express");
const router = express.Router();
const plannerController = require("../controllers/plannerController");

router.get("/", plannerController.getTodayTasks);
router.get("/date/:date", plannerController.getTasksByDate);
router.post("/add", plannerController.addTask);
router.post("/complete/:id", plannerController.completeTask);

module.exports = router;

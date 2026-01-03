const express = require("express");
const router = express.Router();
const workshopController = require("../controllers/workshopController");

// 👇 Specific routes FIRST
router.get("/admin/create", workshopController.showCreateForm);
router.post("/admin/create", workshopController.createWorkshop);
router.get("/admin/enrollments", workshopController.viewEnrollments);
router.post("/admin/delete/:id", workshopController.deleteWorkshop); 

router.get("/my-enrollments",  workshopController.myEnrollments);
router.post("/unenroll/:id",  workshopController.unenrollWorkshop);
router.post("/enroll/:id", workshopController.enrollWorkshop);

// 👇 Generic dynamic route LAST
router.get("/:id", workshopController.viewWorkshopDetails);

// 👇 Homepage route at the very bottom (optional)
router.get("/", workshopController.viewAllWorkshops);

module.exports = router;

const express = require("express");
const router = express.Router();
const jobController = require("../controllers/jobController");
const multer = require("multer");
const path = require("path");

// Multer config for resume uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/uploads");
  },
  filename: (req, file, cb) => {
    const unique = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, unique + path.extname(file.originalname));
  }
});
const upload = multer({ storage });

// ========== USER ROUTES ==========
router.get("/", jobController.listJobs);                      // List all jobs for user
router.get("/my/applications", jobController.myApplications); // View user's applied jobs
router.post("/:id/apply", upload.single("resume"), jobController.applyJob); // Apply to a job

// ========== ADMIN ROUTES (keep these before dynamic job detail route) ==========
router.get("/new", jobController.newJobForm);        // Show form to create job
router.post("/new", jobController.createJob);        // Handle create job
router.get("/manage", jobController.manageJobs);     // Admin job manage dashboard
router.get("/:id/edit", jobController.editJobForm);  // Edit job form
router.post("/:id/edit", jobController.updateJob);   // Update job details
router.delete("/:id", jobController.deleteJob);      // Delete a job
router.get("/:id/applicants", jobController.viewApplicants);  // View applicants
router.get("/:id/applicants/:appId", jobController.viewApplicantDetails); // View applicant detail
router.post("/:id/applicants/:appId/decision", jobController.handleApplication); // Accept/Reject
router.delete("/:appId/delete", jobController.deleteApplication);


// ========== JOB DETAILS ROUTE (MUST COME LAST) ==========
router.get("/:id", jobController.jobDetails); // View job detail by ID

module.exports = router;

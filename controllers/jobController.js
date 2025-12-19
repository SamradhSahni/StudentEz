const Job = require("../models/Job");
const Application = require("../models/Application");
const User = require("../models/User");
const mongoose = require("mongoose");

exports.listJobs = async (req, res) => {
  const jobs = await Job.find().sort({ createdAt: -1 });
  res.render("jobs/index", { jobs });
};

exports.newJobForm = (req, res) => {
  if (!res.locals.user?.isAdmin) return res.redirect("/jobs");
  res.render("jobs/new");
};

exports.createJob = async (req, res) => {
  const {
    title,
    company,
    logoUrl,
    salary,
    deadline,
    openings,
    description,
    experience,
    skills
  } = req.body;

  // Ensure user is logged in and is admin
  const creator = await User.findById(req.session.userId);
  if (!creator || !creator.isAdmin) {
    return res.status(403).send("Unauthorized");
  }

  const job = new Job({
    title,
    company,
    logoUrl,
    salary,
    deadline,
    openings,
    description,
    experience,
    skills: skills.split(',').map(skill => skill.trim()),
    createdBy: creator._id
  });

  await job.save();
  res.redirect("/jobs");
};



exports.jobDetails = async (req, res) => {
  const id = req.params.id;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send("Invalid Job ID");
  }

  const job = await Job.findById(id);
  if (!job) {
    return res.status(404).send("Job not found");
  }

  res.render("jobs/details", { job });
};

exports.applyJob = async (req, res) => {
  const existing = await Application.findOne({
    job: req.params.id,
    applicant: req.session.userId
  });
  if (existing) return res.redirect("/jobs/" + req.params.id);

  const { name, email, contact } = req.body;

  await Application.create({
    job: req.params.id,
    applicant: req.session.userId,
    resume: req.file.filename,
    name,
    email,
    contact
  });

  res.redirect("/jobs/my/applications");
};


exports.viewApplicants = async (req, res) => {
  const jobId = req.params.id;

  if (!mongoose.Types.ObjectId.isValid(jobId)) {
    return res.status(400).send("Invalid Job ID");
  }

  try {
    const job = await Job.findById(jobId);
    if (!job) {
      req.flash("error_msg", "Job not found");
      return res.redirect("/jobs/manage");
    }

    // Make sure only job creator (admin) can view applicants
    if (!job.createdBy || job.createdBy.toString() !== req.session.userId.toString()) {
      req.flash("error_msg", "Unauthorized access");
      return res.redirect("/jobs/manage");
    }

    const applications = await Application.find({ job: jobId });


    res.render("jobs/view_applicants", {
      job,
      applicants: applications
    });
  } catch (err) {
    console.error("Error in viewApplicants:", err);
    req.flash("error_msg", "Something went wrong");
    res.redirect("/jobs/manage");
  }
};





exports.viewApplicantDetails = async (req, res) => {
  const application = await Application.findById(req.params.appId).populate("applicant job");
  res.render("jobs/applicantDetails", { application });
};

exports.handleApplication = async (req, res) => {
  const { status, note } = req.body;
  await Application.findByIdAndUpdate(req.params.appId, { status, note });
  res.redirect(`/jobs/${req.params.id}/applicants`);
};

exports.myApplications = async (req, res) => {
  const applications = await Application.find({ applicant: req.session.userId })
    .populate("job")
    .sort({ appliedAt: -1 });
  res.render("jobs/myApplications", { applications });
};
exports.manageJobs = async (req, res) => {
  try {
    const jobs = await Job.find().sort({ createdAt: -1 });
    res.render("jobs/admin_manage", { jobs });
  } catch (err) {
    console.error(err);
    res.status(500).send("Error loading job management page");
  }
};
exports.deleteJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) {
      req.flash("error_msg", "Job not found");
      return res.redirect("/jobs/manage");
    }

    await Job.findByIdAndDelete(req.params.id);
    req.flash("success_msg", "Job deleted successfully");
    res.redirect("/jobs/manage");
  } catch (err) {
    console.error(err);
    req.flash("error_msg", "Something went wrong");
    res.redirect("/jobs/manage");
  }
};


// GET: Show Edit Job Form
exports.editJobForm = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) return res.status(404).send("Job not found");
    res.render("jobs/edit", { job });
  } catch (err) {
    res.status(500).send("Error loading job for editing");
  }
};

// POST: Handle Job Update
exports.updateJob = async (req, res) => {
  try {
    const {
      title,
      company,
      logoUrl,
      salary,
      experience,
      skills,
      description,
      deadline
    } = req.body;

    await Job.findByIdAndUpdate(req.params.id, {
      title,
      company,
      logoUrl,
      salary,
      experience,
      skills: skills.split(',').map(skill => skill.trim()),
      description,
      deadline
    });

    res.redirect("/jobs/manage");
  } catch (err) {
    console.error("Error updating job:", err);
    res.status(500).send("Error updating job");
  }
};

exports.deleteApplication = async (req, res) => {
  try {
    const app = await Application.findById(req.params.appId);
    if (!app || app.applicant.toString() !== req.session.userId.toString()) {
      return res.status(403).send("Unauthorized or Application not found");
    }

    await Application.findByIdAndDelete(req.params.appId);
    req.flash("success_msg", "Application deleted successfully");
    res.redirect("/jobs/my/applications");
  } catch (err) {
    console.error("Error deleting application:", err);
    req.flash("error_msg", "Something went wrong");
    res.redirect("/jobs/my/applications");
  }
};


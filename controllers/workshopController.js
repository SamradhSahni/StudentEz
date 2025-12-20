const Workshop = require("../models/Workshop");
const User = require("../models/User");

module.exports.viewAllWorkshops = async (req, res) => {
  const workshops = await Workshop.find().sort({ date: 1 });
  res.render("workshop/workshoplist", { workshops });
};

module.exports.viewWorkshopDetails = async (req, res) => {
  const workshop = await Workshop.findById(req.params.id).populate("createdBy", "name email");
  
  let userId = req.user?._id || req.session.userId;
  const isEnrolled = userId ? workshop.enrolledUsers.includes(userId.toString()) : false;

  res.render("workshop/details", { workshop, isEnrolled });
};

module.exports.enrollWorkshop = async (req, res) => {
  const workshop = await Workshop.findById(req.params.id);
  let userId = req.user?._id || req.session.userId;

  if (!workshop.enrolledUsers.includes(userId.toString())) {
    workshop.enrolledUsers.push(userId);
    await workshop.save();
  }

  res.redirect(`/workshops/${req.params.id}`);
};

module.exports.showCreateForm = async (req, res) => {
  let user = req.user;
  if (!user && req.session.userId) {
    user = await User.findById(req.session.userId);
  }

  if (!user || !user.isAdmin) return res.redirect("/workshops");
  res.render("workshop/create");
};

module.exports.createWorkshop = async (req, res) => {
  let user = req.user;
  if (!user && req.session.userId) {
    user = await User.findById(req.session.userId);
  }

  if (!user || !user.isAdmin) return res.redirect("/workshops");

  const { title, instructor, time, date, description, location, imageUrl } = req.body;

  await Workshop.create({
    title,
    instructor,
    time,
    date,
    description,
    location,
    imageUrl,
    createdBy: user._id,
  });

  res.redirect("/workshops");
};

module.exports.viewEnrollments = async (req, res) => {
  let user = req.user;
  if (!user && req.session.userId) {
    user = await User.findById(req.session.userId);
  }

  if (!user || !user.isAdmin) return res.redirect("/workshops");

  const workshops = await Workshop.find({ createdBy: user._id })
    .populate("enrolledUsers", "username email");

  res.render("workshop/enrollments", { workshops });
};

module.exports.deleteWorkshop = async (req, res) => {
  let user = req.user;
  if (!user && req.session.userId) {
    user = await User.findById(req.session.userId);
  }

  if (!user || !user.isAdmin) {
    return res.status(403).send("Unauthorized");
  }

  const { id } = req.params;

  try {
    await Workshop.findByIdAndDelete(id);
    res.redirect("/workshops");
  } catch (err) {
    console.error("Failed to delete workshop:", err);
    res.status(500).send("Server error");
  }
};

module.exports.myEnrollments = async (req, res) => {
  try {
    let userId = req.user?._id || req.session.userId;
    if (!userId) return res.redirect("/login");

    const workshops = await Workshop.find({ enrolledUsers: userId });

    res.render("workshop/myEnrollments", { workshops, user: req.user });
  } catch (err) {
    console.error("Failed to fetch myEnrollments:", err);
    res.status(500).send("Server error");
  }
};

module.exports.unenrollWorkshop = async (req, res) => {
  try {
    let userId = req.user?._id || req.session.userId;
    if (!userId) return res.redirect("/login");

    const workshopId = req.params.id;

    await Workshop.findByIdAndUpdate(workshopId, {
      $pull: { enrolledUsers: userId },
    });

    res.redirect("/workshops/my-enrollments");
  } catch (err) {
    console.error("Failed to unenroll:", err);
    res.status(500).send("Server error");
  }
};

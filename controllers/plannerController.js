const Task = require("../models/Task");

module.exports.getTodayTasks = async (req, res) => {
  const today = new Date().toISOString().split("T")[0];
  const tasks = await Task.find({ userId: req.session.userId, date: today });
  res.render("planner/plannerpage", { tasks, date: today });
};

module.exports.getTasksByDate = async (req, res) => {
  const tasks = await Task.find({ userId: req.session.userId, date: req.params.date });
  res.render("planner/date", { tasks, date: req.params.date });
};

module.exports.addTask = async (req, res) => {
  await Task.create({ ...req.body, completed: false, userId: req.session.userId });
  res.redirect("/planner/date/" + req.body.date);
};

module.exports.completeTask = async (req, res) => {
  await Task.findByIdAndUpdate(req.params.id, { completed: true });
  res.redirect("/planner");
};

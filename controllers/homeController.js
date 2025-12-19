const Subject = require('../models/subject');

module.exports.getHome = async (req, res) => {
  const subjects = await Subject.find({ userId: req.session.userId });
  const goal = req.session.goal ;
  res.render('home', { subjects, goal });
};

module.exports.setGoal = (req, res) => {
  req.session.goal = parseInt(req.body.goal);
  res.redirect('/attendance'); 
};


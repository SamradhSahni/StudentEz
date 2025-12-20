const Subject = require('../models/subject');
const Attendance = require('../models/attendance');

module.exports.getSubjects = async (req, res) => {
  const subjects = await Subject.find({ userId: req.session.userId });
  res.render('subjects', { subjects });
};

module.exports.postAddSubject = async (req, res) => {
  const subject = await Subject.create({
    name: req.body.name,
    userId: req.session.userId
  });
  await Attendance.create({ subjectId: subject._id, userId: req.session.userId });
  res.redirect('/attendance');
};

const Attendance = require('../models/attendance');
const Subject = require('../models/subject');

module.exports.renderAttendancePage = async (req, res) => {
  try {
    const subjects = await Subject.find({ userId: req.session.userId });
    const goal = req.session.goal || 75;
    res.render('attendance', { subjects, goal });
  } catch (err) {
    console.error("Error loading attendance page:", err);
    res.status(500).send("Something went wrong");
  }
};

module.exports.getMarkForm = async (req, res) => {
  try {
    const attendance = await Attendance.findOne({ subjectId: req.params.id });
    res.render('mark', { attendance });
  } catch (err) {
    console.error("Error loading mark form:", err);
    res.status(500).send("Something went wrong");
  }
};

module.exports.postMarkAttendance = async (req, res) => {
  try {
    const attendance = await Attendance.findOne({ subjectId: req.params.id });
    attendance.totalClasses += 1;
    if (req.body.status === 'present') {
      attendance.attendedClasses += 1;
    }
    await attendance.save();
    res.redirect('/attendance');  // ✅ redirect to attendance page
  } catch (err) {
    console.error("Error marking attendance:", err);
    res.status(500).send("Something went wrong");
  }
};

module.exports.getSummary = async (req, res) => {
  try {
    const attendance = await Attendance.findOne({ subjectId: req.params.id, userId: req.session.userId });

    if (!attendance) {
      return res.status(404).send('Attendance record not found.');
    }

    const goal = req.session.goal || 75;

    const percentage = attendance.totalClasses === 0
      ? 0
      : Math.round((attendance.attendedClasses / attendance.totalClasses) * 100);

    const canMiss = percentage >= goal
      ? Math.floor((attendance.attendedClasses * 100 / goal) - attendance.totalClasses)
      : 0;

    const mustAttend = percentage < goal
      ? Math.ceil(((goal * attendance.totalClasses) - (attendance.attendedClasses * 100)) / (100 - goal))
      : 0;

    res.render('summary', { attendance, percentage, goal, canMiss, mustAttend });
  } catch (err) {
    console.error("Error in getSummary:", err);
    res.status(500).send("Something went wrong");
  }
};

module.exports.getEditAttendance = async (req, res) => {
  try {
    const attendance = await Attendance.findOne({ subjectId: req.params.id, userId: req.session.userId });
    res.render('edit', { attendance });
  } catch (err) {
    console.error("Error loading edit page:", err);
    res.status(500).send("Something went wrong");
  }
};

module.exports.postEditAttendance = async (req, res) => {
  try {
    const { total, attended } = req.body;
    const attendance = await Attendance.findOne({ subjectId: req.params.id, userId: req.session.userId });
    attendance.totalClasses = parseInt(total);
    attendance.attendedClasses = Math.min(parseInt(attended), parseInt(total)); 
    await attendance.save();
    res.redirect('/attendance');  // ✅ redirect to attendance page
  } catch (err) {
    console.error("Error editing attendance:", err);
    res.status(500).send("Something went wrong");
  }
};

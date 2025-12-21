const mongoose = require('mongoose');

const attendanceSchema = new mongoose.Schema({
  subjectId: { type: mongoose.Schema.Types.ObjectId, ref: 'Subject' },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  totalClasses: { type: Number, default: 0 },
  attendedClasses: { type: Number, default: 0 },
});

module.exports = mongoose.model('Attendance', attendanceSchema);

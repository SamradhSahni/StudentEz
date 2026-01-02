const express = require('express');
const router = express.Router();
const { getMarkForm, postMarkAttendance, getSummary,getEditAttendance,postEditAttendance } = require('../controllers/attendanceController');
router.get("/", require('../controllers/attendanceController').renderAttendancePage);

router.get('/mark/:id', getMarkForm);
router.post('/mark/:id', postMarkAttendance);
router.get('/summary/:id', getSummary);
router.get('/edit/:id', getEditAttendance);
router.post('/edit/:id', postEditAttendance);

module.exports = router;

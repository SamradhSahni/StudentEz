const express = require('express');
const router = express.Router();
const { getSubjects, postAddSubject } = require('../controllers/subjectController');

router.get('/', getSubjects);
router.post('/add', postAddSubject);
module.exports = router;

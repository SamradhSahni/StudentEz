const express = require('express');
const router = express.Router();
const { getHome, setGoal } = require('../controllers/homeController');

router.get('/', getHome);
router.post('/set-goal', setGoal);

module.exports = router;

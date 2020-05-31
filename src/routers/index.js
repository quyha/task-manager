const express = require('express');
const router = new express.Router();
const userRoute = require('../components/users/user.route');
const taskRoute = require('../components/tasks/task.route');

router.use('/api/users', userRoute);
router.use('/api/tasks', taskRoute);

module.exports = router;

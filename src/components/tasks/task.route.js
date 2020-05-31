const express = require('express');
const router = new express.Router();
const Task = require('../tasks/task.model');
const auth = require('../../middleware/auth');

router.post('/', auth, async (req, res) => {
	const task = new Task({
		...req.body,
		owner: req.user.id,
	});

	try {
		const taskCreated = await task.save();
		return res.send(taskCreated);
	} catch (error) {
		res.status(400).send();
	}
});

// GET /?completed=true
// GET /?limit=1&skip=2
// GET />sortBy=createdAt:desc
router.get('/', auth, async (req, res) => {
	const { user } = req;
	const { completed, limit, skip, sortBy } = req.query;

	const match = {};
	const sort = {};

	if (completed) {
		match.completed = completed === 'true' ? true : false;
	}

	if (sortBy) {
		const parts = sortBy.split(':');
		sort[parts[0]] = parts[1] === 'desc' ? -1 : 1;
	}

	try {
		const { tasks } = await user
			.populate({
				path: 'tasks',
				match,
				options: {
					limit: parseInt(limit, 10),
					skip: parseInt(skip, 10),
					sort,
				},
			})
			.execPopulate();

		return res.send(tasks);
	} catch (error) {
		return res.status(400).send();
	}
});

router.get('/:id', auth, async (req, res) => {
	const { id } = req.params;
	const { user } = req;

	try {
		const task = await Task.findOne({ _id: id, owner: user.id });

		if (!task) {
			return res.status(404).send();
		}

		return res.send(task);
	} catch (error) {
		res.status(400).send();
	}
});

router.put('/:id', auth, async (req, res) => {
	const { id } = req.params;
	try {
		const { user } = req;
		const updates = Object.keys(req.body);
		const task = await Task.findOne({ _id: id, owner: user.id });

		if (!task) {
			return res.status(404).send();
		}

		updates.forEach((update) => (task[update] = req.body[update]));

		const taskUpdated = await task.save();
		return res.send(taskUpdated);
	} catch (error) {
		res.status(400).send();
	}
});

router.delete('/:id', auth, async (req, res) => {
	try {
		const { id } = req.params;
		const { user } = req;

		const task = await Task.findOneAndDelete({ _id: id, owner: user.id });

		if (!task) {
			return res.status(404).send();
		}

		return res.send(task);
	} catch (error) {
		return res.status(400).send();
	}
});

module.exports = router;

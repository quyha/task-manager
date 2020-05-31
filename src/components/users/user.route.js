const express = require('express');
const router = new express.Router();
const User = require('../users/user.model');
const auth = require('../../middleware/auth');

router.post('/login', async (req, res) => {
	try {
		const user = await User.findByCredential(
			req.body.email,
			req.body.password
		);
		const token = user.generateJWT();

		res.send({ user, token });
	} catch (error) {
		return res.status(400).send({ message: 'Can not login!' });
	}
});

router.post('/logout', auth, async (req, res) => {
	try {
		const { user, token } = req;
		user.tokens = user.tokens.filter((t) => t.token !== token);
		await user.save();

		res.send({ message: 'Logout successful!' });
	} catch (error) {
		res.status(500).send();
	}
});

router.post('/logout-all', auth, async (req, res) => {
	try {
		const { user } = req;
		user.tokens = [];

		await user.save();

		res.send({ message: 'Logout successful!' });
	} catch (error) {
		res.status(500).send();
	}
});

router.post('/', async (req, res) => {
	try {
		const user = new User(req.body);
		await user.save();
		const token = user.generateJWT();
		return res.send({ user, token });
	} catch (error) {
		return res.status(400).send();
	}
});

router.get('/me', auth, (req, res) => {
	res.send(req.user);
});

router.put('/me', auth, async (req, res) => {
	const { user } = req;
	const updates = Object.keys(req.body);

	try {
		updates.forEach((update) => (user[update] = req.body[update]));
		const userUpdated = await user.save();

		return res.send(userUpdated);
	} catch (error) {
		res.status(400).send();
	}
});

router.delete('/me', auth, async (req, res) => {
	try {
		await req.user.remove();
		res.send(req.user);
	} catch (error) {
		res.status(500).send();
	}
});

module.exports = router;

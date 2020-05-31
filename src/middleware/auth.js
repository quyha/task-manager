const jwt = require('jsonwebtoken');
const User = require('../components/users/user.model');

function getTokenFromHeader(req) {
	const authorization = req.header('Authorization');

	if (authorization && authorization.split(' ')[0] === 'Bearer') {
		return authorization.split(' ')[1];
	}
	return null;
}

const auth = async (req, res, next) => {
	try {
		const token = getTokenFromHeader(req);

		if (!token) {
			return res.status(401).send({ error: 'Please authenticate' });
		}

		const decoded = jwt.verify(token, 'secret');
		// if don't save token on database, using findById to get user
		const user = await User.findOne({
			_id: decoded.id,
			'tokens.token': token,
		});

		if (!user) {
			throw new Error();
		}

		req.token = token;
		req.user = user;
		next();
	} catch (error) {
		res.status(401).send({ error: 'Please authenticate' });
	}
};

module.exports = auth;

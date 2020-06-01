const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Task = require('../tasks/task.model');

const schema = new mongoose.Schema(
	{
		name: {
			type: String,
			required: true,
			trim: true,
		},
		email: {
			type: String,
			required: true,
			unique: true,
			trim: true,
			lowercase: true,
			validate: {
				validator: (value) => validator.isEmail(value),
				message: 'Email invalid',
			},
		},
		password: {
			type: String,
			required: true,
			trim: true,
			minlength: [6, 'Password must greater than 6 character!'],
		},
		age: {
			type: Number,
			default: 0,
		},
		tokens: [
			{
				token: {
					type: String,
					required: true,
				},
			},
		],
		avatar: {
			type: Buffer,
		},
	},
	{ timestamps: true }
);

schema.virtual('tasks', {
	ref: 'Task',
	localField: '_id',
	foreignField: 'owner',
});

schema.methods.toJSON = function () {
	return {
		id: this._id,
		email: this.email,
		age: this.age,
		name: this.name,
	};
};

schema.methods.generateJWT = function () {
	const user = this;
	const token = jwt.sign({ id: user._id.toString() }, process.env.JWT_SECRET);
	user.tokens = user.tokens.concat({ token });
	user.save();
	return token;
};

schema.statics.findByCredential = async (email, password) => {
	const user = await User.findOne({ email });

	if (!user) {
		throw new Error('Unable to login');
	}

	try {
		const isMatch = await bcrypt.compare(password + '', user.password);

		if (!isMatch) {
			throw new Error('Unable to Login');
		}

		return user;
	} catch (error) {
		throw new Error(error);
	}
};

schema.pre('save', async function (next) {
	const user = this;

	if (user.isModified('password')) {
		user.password = await bcrypt.hash(user.password, 8);
	}

	next();
});

// Delete user tasks when user is removed

schema.pre('remove', async function (next) {
	const user = this;
	await Task.deleteMany({ owner: user._id });
	next();
});

const User = mongoose.model('User', schema);

module.exports = User;

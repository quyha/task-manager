const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const User = require('../../components/users/user.model');
const Task = require('../../components/tasks/task.model');

const userOneId = new mongoose.Types.ObjectId();
const userOne = {
	_id: userOneId,
	name: 'usr test',
	email: 'test@example.com',
	password: 123456,
	tokens: [
		{
			token: jwt.sign(
				{ id: userOneId.toString() },
				process.env.JWT_SECRET
			),
		},
	],
};

const userTwoId = new mongoose.Types.ObjectId();
const userTwo = {
	_id: userTwoId,
	name: 'usr test 2',
	email: 'test2@example.com',
	password: 1234567890,
	tokens: [
		{
			token: jwt.sign(
				{ id: userTwoId.toString() },
				process.env.JWT_SECRET
			),
		},
	],
};

const taskOne = {
	_id: new mongoose.Types.ObjectId(),
	description: 'First task',
	completed: false,
	owner: userOneId,
};
const taskTwo = {
	_id: new mongoose.Types.ObjectId(),
	description: 'Second task',
	completed: true,
	owner: userTwoId,
};
const taskThree = {
	_id: new mongoose.Types.ObjectId(),
	description: 'Third task',
	completed: true,
	owner: userOneId,
};

const setupDatabase = async () => {
	await User.deleteMany();
	await Task.deleteMany();
	await new User(userOne).save();
	await new User(userTwo).save();
	await new Task(taskOne).save();
	await new Task(taskTwo).save();
	await new Task(taskThree).save();
};

module.exports = {
	userOne,
	userOneId,
	userTwo,
	userTwoId,
	taskOne,
	taskTwo,
	taskThree,
	setupDatabase,
};

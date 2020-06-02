const request = require('supertest');
const app = require('../../app');
const Task = require('./task.model');
const {
	userOne,
	userTwo,
	setupDatabase,
	taskOne,
	taskTwo,
	taskThree,
} = require('../../tests/fixtures/db');

beforeEach(setupDatabase);

test('Should create task for user', async () => {
	const response = await request(app)
		.post('/api/tasks')
		.set('Authorization', `Bearer ${userOne.tokens[0].token}`)
		.send({
			description: 'From test',
		})
		.expect(200);
	const task = await Task.findById(response.body._id);
	expect(task).not.toBeNull();
	expect(task.completed).toEqual(false);
});

test('Should get tasks for user', async () => {
	const response = await request(app)
		.get('/api/tasks')
		.set('Authorization', `Bearer ${userOne.tokens[0].token}`)
		.send()
		.expect(200);

	expect(response.body.length).toEqual(2);
});

test('Should not delete other users task', async () => {
	const response = await request(app)
		.delete(`/api/tasks/${taskOne._id}`)
		.set('Authorization', `Bearer ${userTwo._id}`)
		.send()
		.expect(401);

	const task = await Task.findById(taskOne._id);
	expect(task).not.toBeNull();
});

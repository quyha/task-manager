const request = require('supertest');
const app = require('../../app');
const User = require('./user.model');
const {
	userOne,
	userOneId,
	setupDatabase,
} = require('../../tests/fixtures/db');

beforeEach(setupDatabase);

test('Should signup a new user', async () => {
	const response = await request(app)
		.post('/api/users')
		.send({
			name: 'Quy',
			email: 'email@gmail.com',
			password: 123456,
			age: 26,
		})
		.expect(200);

	const user = await User.findById(response.body.user.id);

	expect(user).not.toBeNull();
	expect(response.body).toMatchObject({
		user: {
			name: 'Quy',
			email: 'email@gmail.com',
		},
		token: user.tokens[0].token,
	});
	expect(user.password).not.toBe(123456);
});

test('Should login existing user', async () => {
	const response = await request(app)
		.post('/api/users/login')
		.send({
			email: 'test@example.com',
			password: 123456,
		})
		.expect(200);

	const user = await User.findById(userOneId);
	expect(response.body.token).toBe(user.tokens[1].token);
});

test('Should not login existing user', async () => {
	await request(app)
		.post('/api/users/login')
		.send({
			email: 'test@gmail.com',
			password: 123456,
		})
		.expect(400);
});

test('Should get profile for user', async () => {
	await request(app)
		.get('/api/users/me')
		.set('Authorization', `Bearer ${userOne.tokens[0].token}`)
		.send()
		.expect(200);
});

test('Should get profile for unauthenticated user', async () => {
	await request(app).get('/api/users/me').send().expect(401);
});

// test('Should upload avatar image', async () => {
// 	await request(app)
// 		.post('/api/users/me/avatar')
// 		.set('Authorization', `Bearer ${userOne.tokens[0].token}`)
// 		.attach('avatar', 'src/tests/fixtures/profile-pic.jpg')
// 		.expect(200);
// });

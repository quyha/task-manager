const sgMail = require('@sendgrid/mail');

const SENGRID_API_KEY = process.env.SENGRID_API_KEY;

sgMail.setApiKey(SENGRID_API_KEY);

const sendWelcomeEmail = (email) => {
	sgMail.send({
		to: email,
		from: 'namvannguyen121@gmail.com',
		subject: 'Sending with SendGrid',
		text: 'Thanks for joining in!',
		html: '<strong>Welcome to the app!</strong>',
	});
};

module.exports = { sendWelcomeEmail };

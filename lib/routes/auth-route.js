var User = require('../models/Account');

var internals = {};

/**
 * Show the registration form
 *
 * @param request
 */
internals.index = function (request) {
	request.reply.view(
		'register', {
			title: 'Registrierung'
		}
	);
};

/**
 * Register a user
 *
 * @param request
 * @param reply The incoming requests' reply method
 */
internals.processRegistration = function (request, reply) {
	var newUser = new User({
		lastname: request.payload.lastname,
		firstname: request.payload.lastname,
		nickname: request.payload.nickname,
		email: request.payload.email,
		password: request.payload.password,
		gender: request.payload.gender,
		role: request.payload.role
	});

	/**
	 * Save Account
	 */
	newUser.save(function (err, user) {
		if (err) {
			return reply.redirect('/register').code(400);
		} else {
			return reply.redirect('/').code(302);
		}
	});

};

/**
 * Show the login form
 *
 * @param request
 * @param reply
 */
internals.loginForm = function (request, reply) {
	reply.view(
		'auth/loginForm', {
			title: 'Anmeldung'
		}
	)
};

module.exports = internals;
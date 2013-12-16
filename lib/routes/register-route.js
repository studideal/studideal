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
	console.log(request.payload);

	var newUser = new User({
		lastname: request.payload.lastname,
		firstname: request.payload.lastname,
		nickname: request.payload.nickname,
		email: request.payload.email,
		password: request.payload.password,
		gender: request.payload.gender,
		role: request.payload.role
	});

	newUser.save(function(err, user){
		if (err){
			console.log(err);
			return reply.redirect('/register').code(302);
		}
		console.log('Created new user: ' + user.nickname);
	});

	reply.redirect('/').code(302);
};

module.exports = internals;
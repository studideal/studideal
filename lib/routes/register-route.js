var internals = {};

internals.index = function(request){
	request.reply.view(
			'register', {
				title: 'Registrierung'
			}
	);
};

module.exports = internals;
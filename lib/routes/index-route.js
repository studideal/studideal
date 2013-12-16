var internals = {};

internals.index = function (request) {
	request.reply.view(
			'index', {
				title: 'Home'
			}
	);
};

module.exports = internals;
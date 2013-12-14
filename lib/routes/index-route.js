var internals = {};

internals.index = function(request){
	request.reply.view('index.html', { greeting: 'hello world' });
};

module.exports = internals;
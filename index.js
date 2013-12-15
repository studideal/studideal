var Hapi = require('hapi');

var options = {
	cache: {
		engine: 'redis',
		host: '127.0.0.1',
		port: 6379
	},
	views: {
		path: "templates",
		engines: {
			"hbs": "handlebars"
		},
		layout: true
	}
};

// Create a server with a host, port, and options
var server = Hapi.createServer('localhost', 8000, options);

// Define the route
var indexRoute = {
	handler: require('./lib/routes/index-route.js').index
};

// Add the route
server.route(
		{
			method: 'GET',
			path: '/',
			config: indexRoute
		}
);

server.route(
		{
			method: 'GET',
			path: '/{path*}',
			handler: {
				directory: { path: './public', listing: false, index: true }
			}
		}
);

// Start the server
server.start();
var Hapi = require('hapi');

var options = {
	cache: [
		{
			"name": "shared",
			"engine": "redis",
			"partition": "http",
			"shared": true,
			"host": "127.0.0.1",
			"port": 6379
		}
	],
	views: {
		path: "templates",
		engines: {
			"hbs": "handlebars"
		},
		layout: true,
		partialsPath: "templates/partials"
	},
	"plugins": {
		"yar": [
			{
				"ext": true
			},
			{
				"cookieOptions": {
					"password": "secret"
				}
			}
		],
		"good": {
			"subscribers": {
				"console": ["ops", "request", "log", "error"],
				"./logs/request.log": ["request"],
				"./logs/ops.log": ["ops"],
				"./logs/log.log": ["log"],
				"./logs/internal_error.log": ["error"]
			},
			"gcDetection": true,
			"opsInterval": 30000,
			"extendedRequests": true
		},
		"furball": null,
		"lout": null
	}
};

// Create a server with a host, port, and options
var server = Hapi.createServer('localhost', 8000, options);

// Log plugin
server.pack.allow({ ext: true }).require('good', options.plugins.good, function (err) {
	console.log("Error loading good module:");
	console.log(err);
});

// cookie plugin
server.pack.allow({ext: true}).require('yar', options.plugins.yar, function (err) {
	console.log("Error loading yar module:");
	console.log(err);
});

// Add the route
server.route(
		{
			config: {
				handler: require('./lib/routes/index-route.js').index,
				cache: {
					expiresIn: 20000
				}
			},
			method: 'GET',
			path: '/'
		}
);

server.route(
		{
			config: {
				cache: {
					expiresIn: 20000
				}
			},
			method: 'GET',
			path: '/{path*}',
			handler: {
				directory: { path: './public', listing: false, index: true }
			}
		}
);

// Start the server
server.start();
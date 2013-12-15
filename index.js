var Hapi = require('hapi');

var internals = {};

/**
 * Reuest pre-handler
 *
 * mostly used for nice error messages
 *
 * @param request
 * @param next
 */
internals.onPreResponse = function (request, next) {
	if (request.response().isBoom) {
		var error = request.response();
		error.response.payload.message = 'Censored Error';
	}

	next();
};

/**
 * Not found handling
 *
 * @param request
 * @param reply
 */
internals.notFoundHandler = function (request, reply) {
	reply('The page was not found').code(404);
	/*request.reply.view(
	 '404',
	 {
	 title: 'Nicht gefunden'
	 }
	 ).code(404);*/
};

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
	if (err) {
		console.log("Error loading good module:");
		console.log(err);
	}
});

// cookie plugin
server.pack.allow({ext: true}).require('yar', options.plugins.yar, function (err) {
	if (err) {
		console.log("Error loading yar module:");
		console.log(err);
	}
});

// lout plugin
server.pack.allow({ext: true}).require('lout', options.plugins.lout, function (err) {
	if (err) {
		console.log("Error loading lout module:");
		console.log(err);
	}
});

/**
 * The index route
 */
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

/**
 * The registration routes
 */

/**
 * The registration form
 */
server.route(
		{
			config: {
				handler: require('./lib/routes/register-route.js').index,
				cache: {
					expiresIn: 20000
				}
			},
			method: 'GET',
			path: '/register'
		}
);

/**
 * The registration handler
 */

/**
 * The static route
 */
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

/**
 * Catch-All Route
 */
server.route({ method: '*', path: '/{p*}', handler: internals.notFoundHandler });

// Start the server
server.start();
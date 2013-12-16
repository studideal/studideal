var Hapi = require('hapi');
var LocalStrategy = require('passport-local').Strategy;

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
		"lout": null,
		"travelogue": {
			hostname: 'localhost',
			port: 8000,
			urls: {
				failureRedirect: '/login'
			},
			excludePaths: ['/public/']
		}
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

// travelogue auth plugin
server.pack.allow({ ext: true }).require('travelogue', options.plugins.travelogue, function (err) {
	if (err) {
		throw err;
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
 * Further server config
 *
 * @doc: Passport
 */
var Passport = server.plugins.travelogue.passport;
Passport.use(new LocalStrategy(function (username, password, done) {
	return done(null, false, { 'message': 'invalid credentials' });
}));
Passport.serializeUser(function (user, done) {

	done(null, user);
});
Passport.deserializeUser(function (obj, done) {

	done(null, obj);
});

/**
 * Debug the events
 */
if (process.env.DEBUG) {
	server.on('internalError', function (event) {

		// Send to console
		console.log(event)
	});
}

/**
 * The index route
 */
server.route(
		{
			config: {
				handler: require('./lib/routes/index-route.js').index,
				cache: {
					expiresIn: 20000
				},
				auth: false
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
 * The service listing
 */
server.route(
		{
			handler: {
				view: 'items/index'
			},
			method: 'GET',
			path: '/list'
		}
);

/**
 * The service listing
 */
server.route(
		{
			handler: {
				view: 'items/detail'
			},
			method: 'GET',
			path: '/detail'
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
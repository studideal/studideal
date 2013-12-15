// Load modules

var Lab = require('lab');
var Hapi = require('hapi');

// Test shortcuts

var expect = Lab.expect;
var before = Lab.before;
var after = Lab.after;
var describe = Lab.experiment;
var it = Lab.test;
var S = Hapi.types.String;

describe('Views', function () {

	var viewsPath = 'templates';
	var routesPath = '../../lib/routes/';

	var options = {
		views: {
			engines: {
				"hbs": "handlebars"
			},
			path: viewsPath,
			layout: true,
			partialsPath: viewsPath + '/partials'
		}
	};

	var server = new Hapi.Server(options);

	describe('#index-route', function () {

		it('shows template when correct path is provided', function (done) {
			server.route({ method: 'GET', path: '/', handler: require(routesPath + 'index-route').index });
			server.inject(
					{
						method: 'GET',
						url: '/'
					}, function (res) {

						expect(res.result).to.contain('Home - StudiDeal');
						done();
					});
		});
	});

	describe('#register-route', function () {

		it('shows template when correct path is provided', function (done) {
			server.route({ method: 'GET', path: '/register', handler: require(routesPath + 'register-route').index });
			server.inject(
					{
						method: 'GET',
						url: '/register'
					}, function (res) {

						expect(res.result).to.contain('Registrierung - StudiDeal');
						done();
					});
		});
	});
});
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

var mongoose = require('mongoose');
var Account = require('../../lib/models/Account');

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

	var dbUri = "mongodb://localhost:27017/mongoose-bcrypt-test-test"
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

		before(function (done) {
			mongoose.connect(dbUri, done);
			Account.remove({}, function (err) {
				console.log('BEFORE - Collection Account cleared');
			});
		});

		it('shows template when correct path is provided', function (done) {
			server.route({ method: 'GET', path: '/register', handler: require(routesPath + 'auth-route').index });
			server.inject(
				{
					method: 'GET',
					url: '/register'
				}, function (res) {

					expect(res.result).to.contain('Registrierung - StudiDeal');
					done();
				});
		});

		/**
		 * Test the registration
		 */
		describe('account creation', function () {
			server.route({ method: 'POST', path: '/register', handler: require(routesPath + 'auth-route').processRegistration});

			it('succeeds if all fields are correct', function (done) {
				server.inject(
					{
						method: 'POST',
						url: '/register',
						payload: {
							lastname: 'Test',
							firstname: 'Test',
							nickname: 'tester',
							email: 'foobar@foo.com',
							password: 'test',
							gender: 'male',
							role: 'student'
						}
					}, function (res) {
						expect(res.raw.res._header).to.contain('HTTP/1.1 302');
						done();
					});
			});
			it('fails when nickname is not filled out', function (done) {
				server.inject(
					{
						method: 'POST',
						url: '/register',
						payload: {
							lastname: 'Test',
							firstname: 'Test',
							email: 'foobar@foo.com',
							password: 'test',
							gender: 'male',
							role: 'student'
						}
					}, function (res) {
						expect(res.raw.res._header).to.contain('HTTP/1.1 400');
						done();
					});
			});
		});
	});

	describe('#login-route', function () {
		before(function(done){
			server.route({ method: 'GET', path: '/login', handler: require(routesPath + 'auth-route').loginForm});
			done();
		});
		it('should show the login page', function (done) {
			server.inject({
				method: 'GET',
				url: '/login'
			}, function (res) {
				expect(res.result).to.contain('Anmeldung - StudiDeal');
				done();
			});
		});
		it('should show the login page with a form containing password and email field', function (done) {
			server.inject({
				method: 'GET',
				url: '/login'
			}, function (res) {
				expect(res.result).to.contain('id="loginForm"');
				expect(res.result).to.contain('id="email"');
				expect(res.result).to.contain('id="password"');
				done();
			});
		});
	});
});
// Load modules

var Lab = require('lab');
var Hapi = require('hapi');

// Test shortcuts

var expect = Lab.expect;
var before = Lab.before;
var beforeEach = Lab.beforeEach;
var after = Lab.after;
var describe = Lab.experiment;
var it = Lab.test;
var S = Hapi.types.String;
var mongoose = require('mongoose');

var Account = require('../../lib/models/Account');

describe('Models', function () {

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

	var correctUser = {
		lastname: 'Test',
		firstname: 'Test',
		nickname: 'tester',
		email: 'foobar@foo.com',
		password: 'test',
		gender: 'male',
		role: 'student'
	};

	var server = new Hapi.Server(options);

	describe('#user-model', function () {
		before(function (done) {
			mongoose.connect(dbUri, done);
			Account.remove({}, function (err) {
				console.log('BEFORE - Collection Account cleared');
			});
		});
		it('allows creating a new user when all is correct', function (done) {
			var correctUserModel = new Account(correctUser);
			correctUserModel.save(function (err, account) {
				if (err) {
					console.log(err);
				}
				Account.find({_id: account._id}, function (err, foundAccount) {
					if (!err) {
						done();
					} else {
						throw(err);
					}
				});
			});
		});
		it('is able to tell wether a password is correct or not', function (done) {
			Account.findOne({email: 'foobar@foo.com'}, function (err, foundAccount) {
				foundAccount.comparePassword('test', function (err, matches) {
					if (err) throw err;
					if (matches === true) done();
				});
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
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

	var options = {
		views: {
			engines: { 'html': 'handlebars' },
			path: viewsPath
		}
	};

	var server = new Hapi.Server(options);

	describe('#index-routes', function () {

		it('shows template when correct path is provided', function (done) {
			server.route({ method: 'GET', path: '/', handler: require('../../lib/routes/index-route').index });
			server.inject(
					{
						method: 'GET',
						url: '/'
					}, function (res) {

						expect(res.result).to.contain('Willkommen');
						done();
					});
		});
	});
});
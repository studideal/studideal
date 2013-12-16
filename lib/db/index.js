var mongoose = require('mongoose');

var connect = function () {
	var connStr = "mongodb://localhost:27017/mongoose-bcrypt-test";
	mongoose.connect(connStr, function (err) {
		if (err) throw err;
		console.log("Successfully connected to MongoDB");
	});
};

module.exports = {
	connect: connect
};
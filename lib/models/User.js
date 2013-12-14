module.exports = function (Mongoose) {

	var Schema = Mongoose.Schema;

	Mongoose.model('lolcat', new Schema({

		username: { type: 'String', required: true },
		picture: { type: 'String', required: true },
		views: { type: 'Number', required: true, default: 0 }

	}, { collection: 'lolcatz' }));

	return Mongoose.model('lolcat');
};
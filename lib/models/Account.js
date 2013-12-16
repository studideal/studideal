var mongoose = require('mongoose'),
		Schema = mongoose.Schema,
		Types = Schema.Types;

var Account = new Schema(
		{
			nickname: String,
			email: Types.email
		}
);

module.exports = mongoose.model('Account', Account);
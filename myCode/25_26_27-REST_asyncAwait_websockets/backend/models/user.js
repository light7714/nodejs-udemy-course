const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
	email: {
		type: String,
		required: true,
	},
	password: {
		type: String,
		required: true,
	},
	name: {
		type: String,
		required: true,
	},
	status: {
		type: String,
		default: 'I am new!'
	},
	//will be reference to posts created by the user
	posts: [
		{
			type: Schema.Types.ObjectId,
			ref: 'Post',
		},
	],
});

//users collection
module.exports = mongoose.model('User', userSchema);

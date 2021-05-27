const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//2nd arg is config options, we'll automatically get createdAt and updatedAt fields by timestamps: true
const postSchema = new Schema(
	{
		title: {
			type: String,
			required: true,
		},
		imageUrl: {
			type: String,
			required: true,
		},
		content: {
			type: String,
			required: true,
		},
		//will later be a link to an user
		creator: {
			type: Object,
			required: true,
		},
	},
	{ timestamps: true }
);

//posts collection will be added
module.exports = mongoose.model('Post', postSchema);
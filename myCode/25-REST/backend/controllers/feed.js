const fs = require('fs');
const path = require('path');

const { validationResult } = require('express-validator');

const Post = require('../models/post');
const User = require('../models/user');

exports.getPosts = (req, res, next) => {
	const currentPage = req.query.page || 1;
	//same value as in frontend (we could pass this to frontend too, but not doing that here)
	const perPage = 2;
	let totalItems;
	Post.find()
		.countDocuments()
		.then((count) => {
			totalItems = count;

			return Post.find()
				.skip((currentPage - 1) * perPage)
				.limit(perPage);
		})
		.then((posts) => {
			//*converts js obj to json, sends it with correct headers (content-type) (here it'll be application/json) (in browser we need to set manually if using fetch api)
			res.status(200).json({
				message: 'Fetched posts successfully',
				posts: posts,
				totalItems: totalItems,
			});
		})
		.catch((err) => {
			if (!err.statusCode) {
				err.statusCode = 500;
			}
			next(err);
		});
};

//not using put, as for multiple posts we might append too (put-> create or overwrite a resource, post->adding, appending)
//could also have named postPost
exports.createPost = (req, res, next) => {
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		//validation is already being done on the frontend tho, also adding in backend

		const error = new Error('Validation failed, entered data is incorrect');
		//custom property statusCode
		error.statusCode = 422;
		throw error;
	}

	if (!req.file) {
		const error = new Error('No image provided');
		error.statusCode = 422;
		throw err;
	}
	//req.file.path holds the path to the file as it was stored on my server (added by multer)
	const imageUrl = req.file.path;
	const title = req.body.title;
	const content = req.body.content;
	let creator;

	//req.userId (in string) is the id of the currently logged in user, added in is-auth.js, mongoose will convert it (due to model post)
	//now we created a new post assigned to that logged in user
	const post = new Post({
		title: title,
		content: content,
		imageUrl: imageUrl,
		creator: req.userId,
	});
	post.save()
		.then((result) => {
			//returning the currently logged in user
			return User.findById(req.userId);
		})
		.then((user) => {
			creator = user;
			// in user model, posts is an array of postIds, but even with this syntax mongoose will automatically extract the postId from post and push that
			user.posts.push(post);
			return user.save();
		})
		.then((result) => {
			// console.log('result of post.save() in feed.js:', result);
			//201 ->  success + a resource was created
			res.status(201).json({
				message: 'Post created successfully',
				post: post,
				creator: {
					_id: creator._id,
					name: creator.name,
				},
			});
		})

		.catch((err) => {
			// console.log('err in save() in feed.js:', err);
			//here in the starting err.statusCode wont exist ofc, but theoretically if the code above was changed where i throw my own errors, then i would need to check
			if (!err.statusCode) {
				//500 -> some server side error
				err.statusCode = 500;
			}
			next(err);
		});
};

exports.getPost = (req, res, next) => {
	const postId = req.params.postId;

	Post.findById(postId)
		.then((post) => {
			if (!post) {
				const error = new Error('Could not find post');
				//404 ->  not found
				error.statusCode(404);
				//as we're throwing error here in then block (not calling next(error), then the next catch block will be reached, and there we're calling next(err))
				throw error;
			}
			res.status(200).json({
				message: 'Post Fetched',
				post: post,
			});
		})
		.catch((err) => {
			if (!err.statusCode) {
				err.statusCode = 500;
			}
			next(err);
		});
};

exports.updatePost = (req, res, next) => {
	const postId = req.params.postId;

	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		const error = new Error('Validation failed, entered data is incorrect');
		error.statusCode = 422;
		throw error;
	}

	const title = req.body.title;
	const content = req.body.content;
	//see README
	console.log('hii', req.body.image, typeof req.body.image, !req.body.image);

	//case when image is not changed, then frontend code has all the logic to take existing url and keep that
	let imageUrl = req.body.image;
	//case when image is changed
	if (req.file) {
		imageUrl = req.file.path;
	}

	//if somehow not able to extract it, and didnt go into if block (validation of imageUrl)
	if (!imageUrl) {
		console.log('heyyy');
		const error = new Error('No file picked');
		error.statusCode = 422;
		throw error;
	}

	Post.findById(postId)
		.then((post) => {
			if (!post) {
				const error = new Error('Could not find post');
				error.statusCode(404);
				throw error;
			}

			//now checking if the id in creator field (creator stores id only) in a post is equal to id of currently logged in user
			if (post.creator.toString() !== req.userId) {
				const error = new Error('Not Authorized!');
				error.statusCode = 403;
				throw error;
			}

			//means image has changed
			if (imageUrl !== post.imageUrl) {
				clearImage(post.imageUrl);
			}

			post.title = title;
			post.imageUrl = imageUrl;
			post.content = content;
			return post.save();
		})
		.then((result) => {
			res.status(200).json({
				message: 'Post Updated',
				post: result,
			});
		})
		.catch((err) => {
			if (!err.statusCode) {
				err.statusCode = 500;
			}
			next(err);
		});
};

exports.deletePost = (req, res, next) => {
	const postId = req.params.postId;
	Post.findById(postId)
		.then((post) => {
			if (!post) {
				const error = new Error('Could not find post');
				error.statusCode(404);
				throw error;
			}

			//now checking if the id in creator field (creator stores id only) in a post is equal to id of currently logged in user
			if (post.creator.toString() !== req.userId) {
				const error = new Error('Not Authorized!');
				error.statusCode = 403;
				throw error;
			}

			clearImage(post.imageUrl);	
			return Post.findByIdAndRemove(postId);
		})
		.then((result) => {
			//after deleting the post, need to delete the post's id from the user doc (who created the post) (posts field is an array of user ids)
			return User.findById(req.userId);
		})
		.then((user) => {
			//mongoose method pull, need to pass id of the post we need to remove
			user.posts.pull(postId);
			return user.save();
		})
		.then((result) => {
			res.status(200).json({ message: 'Deleted the post' });
		})
		.catch((err) => {
			if (!err.statusCode) {
				err.statusCode = 500;
			}
			next(err);
		});
};

const clearImage = (filePath) => {
	filePath = path.join(__dirname, '..', filePath);
	fs.unlink(filePath, (err) => {
		if (err) {
			console.log('err in unlink in clearImage in feed.js:', err);
		}
		// console.log('err in unlinddk in clearImage in feed.js:', err);
	});
};

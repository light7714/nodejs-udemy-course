const fs = require('fs');
const path = require('path');

const { validationResult } = require('express-validator');

const io = require('../socket');
const Post = require('../models/post');
const User = require('../models/user');

//*here, we can accept currentPage and perPage(limit), but if frontend wants to have the pagination where all items appear on the same page when needed, instead of page numbers, then it would be better to have offset and limit as query params. this method allows frontend to have flexibility to choose type of pagination. https://developer.box.com/guides/api-calls/pagination/offset-based/

// exports.getPosts = (req, res, next) => {
// 	const currentPage = req.query.page || 1;
// 	//same value as in frontend (we could pass this to frontend too, or get from frontend in query params, but not doing that here)
// 	const perPage = 2;
// 	let totalItems;
// 	Post.find()
// 		.countDocuments()
// 		.then((count) => {
// 			totalItems = count;

// 			return Post.find()
//populates the creator field with the appropriate values from User table
//				.populate('creator')
// 				.skip((currentPage - 1) * perPage)
// 				.limit(perPage);
// 		})
// 		.then((posts) => {
// 			//*converts js obj to json, sends it with correct headers (content-type) (here it'll be application/json) (in browser we need to set manually if using fetch api)
// 			res.status(200).json({
// 				message: 'Fetched posts successfully',
// 				posts: posts,
// 				totalItems: totalItems,
// 			});
// 		})
// 		.catch((err) => {
// 			if (!err.statusCode) {
// 				err.statusCode = 500;
// 			}
// 			next(err);
// 		});
// };

//* async await syntax of above code
//we have to write async in front of the function in which we wanna use await
//we can write synchronous looking code with this, but still it is asynchronous code. behind the scenes, for each await, an implicit then block gets added.
//in v14.3 of node, we can use top level await, that is, we can use await on a promise outside a function, without using the async keyword (but only in a module file..). inside a fn, we would still use async.
//can use just await, like: await post.save();
exports.getPosts = async (req, res, next) => {
	const currentPage = req.query.page || 1;
	const perPage = 2;
	//just like all then blocks have a single catch, we're doing here that all await blocks have a single catch
	try {
		const totalItems = await Post.find().countDocuments();
		const posts = await Post.find()
			.populate('creator')
			//sorted by descending order
			.sort({ createdAt: -1 })
			.skip((currentPage - 1) * perPage)
			.limit(perPage);

		res.status(200).json({
			message: 'Fetched posts successfully',
			posts: posts,
			totalItems: totalItems,
		});
	} catch (err) {
		if (!err.statusCode) {
			err.statusCode = 500;
		}
		next(err);
	}
};

//not using put, as for multiple posts we might append too (put-> create or overwrite a resource, post->adding, appending)
exports.createPost = async (req, res, next) => {
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

	//req.userId (in string) is the id of the currently logged in user, added in is-auth.js, mongoose will convert it to ObjectId (due to model Post)
	//now we created a new post assigned to that logged in user
	const post = new Post({
		title: title,
		content: content,
		imageUrl: imageUrl,
		creator: req.userId,
	});

	try {
		await post.save();
		const user = await User.findById(req.userId);
		user.posts.push(post);
		await user.save();

		//informing all users that a post is created
		//io written here is the object exported from socket.js file, getIO gives back the real io object (socket object) on which we can apply methods given by socket.io
		//*emit() method sends a msg to all users (sockets)     (there is another method broadcast, on the socket object we got when connection estabilished, that sends msg to all users except the socket on which its called)
		//*1st arg is event name we wanna define, 2nd is data we wanna send, action key is to inform users what happened (channel is posts, action is create)
		//we can send any data tho, but this is the setup we defined
		io.getIO().emit('posts', {
			action: 'create',
			post: {
				...post._doc,
				creator: { _id: req.userId, name: user.name },
			},
		});

		res.status(201).json({
			message: 'Post created successfully',
			post: post,
			creator: {
				_id: user._id,
				name: user.name,
			},
		});
	} catch (err) {
		if (!err.statusCode) {
			err.statusCode = 500;
		}
		next(err);
	}

	// post.save()
	// 	.then((result) => {
	// 		//returning the currently logged in user
	// 		return User.findById(req.userId);
	// 	})
	// 	.then((user) => {
	// 		creator = user;
	// 		// in user model, posts is an array of postIds, but even with this syntax mongoose will automatically extract the postId from post and push that in the array.
	// 		user.posts.push(post);
	// 		return user.save();
	// 	})
	// 	.then((result) => {
	// 		// console.log('result of post.save() in feed.js:', result);
	// 		//201 ->  success + a resource was created
	// 		res.status(201).json({
	// 			message: 'Post created successfully',
	// 			post: post,
	// 			creator: {
	// 				_id: creator._id,
	// 				name: creator.name,
	// 			},
	// 		});
	// 	})

	// 	.catch((err) => {
	// 		// console.log('err in save() in feed.js:', err);
	// 		//here in the starting err.statusCode wont exist ofc, but theoretically if the code above was changed where i throw my own errors, then i would need to check
	// 		if (!err.statusCode) {
	// 			//500 -> some server side error
	// 			err.statusCode = 500;
	// 		}
	// 		next(err);
	// 	});
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
		.populate('creator')
		.then((post) => {
			if (!post) {
				const error = new Error('Could not find post');
				error.statusCode(404);
				throw error;
			}

			//now checking if the id in creator field (creator stores id only) in a post is equal to id of currently logged in user
			//._id added in websockets module
			if (post.creator._id.toString() !== req.userId) {
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
			io.getIO().emit('posts', {
				action: 'update',
				post: result,
			});

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
			io.getIO().emit('posts', { action: 'delete', post: postId });
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

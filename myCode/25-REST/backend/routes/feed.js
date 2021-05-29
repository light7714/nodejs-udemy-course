const express = require('express');
const { body } = require('express-validator');

const feedController = require('../controllers/feed');
const isAuth = require('../middleware/is-auth');

const router = express.Router();

// GET /feed/posts
router.get('/posts', isAuth, feedController.getPosts);

//POST /feed/post
//validation as in frontend
router.post(
	'/post',
	isAuth,
	[
		body('title').trim().isLength({ min: 5 }),
		body('content').trim().isLength({ min: 5 }),
	],
	feedController.createPost
);

//GET /feed/post
router.get('/post/:postId', isAuth, feedController.getPost);

//editing post is like replacing it, thats why using put method (put and patch requests have a req body)
//PUT /feed/post/:postId
router.put(
	'/post/:postId',
	isAuth,
	[
		body('title').trim().isLength({ min: 5 }),
		body('content').trim().isLength({ min: 5 }),
	],
	feedController.updatePost
);

//cant send body in delete routes, thats why encoding data in url
//DELETE /feed/post/:postId
router.delete('/post/:postId', isAuth, feedController.deletePost);

module.exports = router;

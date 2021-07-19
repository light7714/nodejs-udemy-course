const express = require('express');
const { body } = require('express-validator');

const User = require('../models/user');
const authController = require('../controllers/auth');
const isAuth = require('../middleware/is-auth');

const router = express.Router();

//create or overwrite existing user, thats why put
//PUT /auth/signup
router.put(
	'/signup',
	[
		//custom validator to check if email already exists
		body('email')
			.isEmail()
			.withMessage('Please Enter a valid email')
			.custom((value, { req }) => {
				return User.findOne({ email: value }).then((userDoc) => {
					if (userDoc) {
						return Promise.reject('Email already exists!');
					}
				});
			})
			.normalizeEmail(),
		body('password').trim().isLength({ min: 5 }),
		body('name').not().isEmpty().trim(),
	],
	authController.signup
);

//no validation logic here as the email and password will be compared with those in db in controller
//POST /auth/login
router.post('/login', authController.login);

//GET /auth/status
router.get('/status', isAuth, authController.getUserStatus);

//PATCH /auth/status
router.patch(
	'/status',
	isAuth,
	[body('status').trim().not().isEmpty()],
	authController.updateUserStatus
);

module.exports = router;

//not added any route for logout... in frontend code only we remove the token and change relevant variables, so no need of a route

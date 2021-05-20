const process = require('process');

require('dotenv').config();

const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');
const sendgridTransport = require('nodemailer-sendgrid-transport');

const User = require('../models/user');

//*need to intialise transporter (telling nodemailer how emails to be sent)
//returns a configuration nodemailer can use to use sendgrid
const transporter = nodemailer.createTransport(
	sendgridTransport({
		auth: {
			//value to be obtained from sendgrid account (settings->api key->create new. added node-shop as name (one time))
			api_key: process.env.API_KEY,
		},
	})
);

exports.getLogin = (req, res, next) => {
	// console.log(req.flash('error'));
	//*pulling the msg out of session, only arg passed is key, if no error is flashed into the session, it will be an empty array (smh..?), else will be array of messages... (see more)
	let message = req.flash('error');
	if (message.length > 0) {
		message = message[0];
	} else {
		message = null;
	}

	//*We see true on sending different requests (going to diff pages) even though each req is technically separate from each other.
	//*Thats why if we open a new browser, we'll see undefined logged here.
	// console.log('Logged In:', req.session.isLoggedIn);
	res.render('auth/login', {
		path: '/login',
		pageTitle: 'Login',
		errorMessage: message,
	});
};

exports.getSignup = (req, res, next) => {
	let message = req.flash('error');
	if (message.length > 0) {
		message = message[0];
	} else {
		message = null;
	}

	res.render('auth/signup', {
		path: '/signup',
		pageTitle: 'Signup',
		errorMessage: message,
	});
};

//*here,a session will be created with an id, a cookie having the specific session id (hashed) will be created
exports.postLogin = (req, res, next) => {
	const email = req.body.email;
	const password = req.body.password;
	//lhs is email field in doc, rhs is const email
	User.findOne({ email: email })
		.then((user) => {
			if (!user) {
				//*flashing an err msg to the session (so it can persist even after redirecting, and once we pull the msg (in getLogin) from session, it will be dltd), method added by connect-flash package
				//1st arg is key under which msg is stored, 2nd arg is msg
				req.flash('error', 'Invalid email or password!');
				return res.redirect('/login');
			}

			//if user exists, validating password
			//*1st arg is password to check, 2nd is hashed value to check against
			bcrypt
				.compare(password, user.password)
				.then((doMatch) => {
					//doMatch = true, when passwords match, otherwise false
					if (doMatch) {
						//session obj added by the session middleware in app.js, can add any key we want here.
						//*A new cookie connect.sid is set in browser, with a value of hashed session id. By default its session cookie (session here means it'll expire after closing browser (browser dependent))
						req.session.isLoggedIn = true;
						//* req.session.user is not a mongoose object, just plain object. https://stackoverflow.com/questions/18512461/express-cookiesession-and-mongoose-how-can-i-make-request-session-user-be-a-mon/18662693#18662693
						req.session.user = user;
						//*normally no need of writing session.save(), it'll automatically get saved in mongodb using the mongodb store, but as saving is async operation and we need to do redirect after saving, thats why doing writing save() method
						return req.session.save((err) => {
							if (err) {
								console.log(
									'err in session.save() in postLogin in auth.js:',
									err
								);
							}
							//*whenever any response is sent (or even req received), the session cookie will be sent along with it, so even if we do res.send(); the cookie will be sent
							res.redirect('/');
						});
					}

					req.flash('error', 'Invalid email or password!');
					res.redirect('/login');
				})
				.catch((err) => {
					//we'll get err only when something goes wrong, not if passwords dont match
					console.log('err in compare() in auth.js:', err);
					res.redirect('/login');
				});
		})
		.catch((err) => console.log('err in findById in auth.js:', err));
};

exports.postSignup = (req, res, next) => {
	//validation later in course
	const email = req.body.email;
	const password = req.body.password;
	const confirmPassword = req.body.confirmPassword;

	//to check if email doesnt exist in db, 1) we can create an index on email and give it property unique (if u know how to do it), 2) find a user with that email
	//lhs is email field in doc, rhs is const email
	User.findOne({ email: email })
		.then((userDoc) => {
			//if even one doc with that email exists, we dont wanna create new user
			if (userDoc) {
				req.flash(
					'error',
					'Email exists already, please use a different one!'
				);
				return res.redirect('/signup');
			}

			//*hashing the password before storage, 1st arg is what to hash, 2nd is salt (how many rounds of hashing to be applied, higher -> more secure -> longer it'll take)
			//*we wont be able to decrypt this (we'll be able to validate it by using compare fn, as bcrypt has the key)
			return bcrypt
				.hash(password, 12)
				.then((hashedPassword) => {
					const user = new User({
						email: email,
						password: hashedPassword,
						cart: { items: [] },
					});
					return user.save();
				})
				.then((result) => {
					//redirecting immediately, not waiting for email to be sent (below), as even if email goes later its no problem (and sending email is slow, so dont block)
					res.redirect('/login');

					//sending an email after sign up, returns promise
					return transporter.sendMail({
						to: email,
						//verified account to send emails
						from: 'shubhamlightning99@gmail.com',
						subject: 'Sign Up succesfull!',
						html: '<h1>You successfully signed up chomu! 😎<h1>',
					});

				})
				.catch((err) => {
					console.log('err in hash() chain in findOne() in auth.js:', err);
				});
		})
		.catch((err) => {
			console.log('err in findOne() in auth.js:', err);
		});
};

//* this will remove the session (logout button on nav bar)
exports.postLogout = (req, res, next) => {
	//destroy method by express-session package, the fn inside will be called when the session is destroyed
	//*after destroying, the session cookie still exists in browser, but its no prob as the session is deleted, the cookie with new session id will be set after logging in again
	//*actually after redirecting, a new session will be created again for csrf and flash (SO I SHOULD ACTUALLY DELETE isLoggedIn and user from session OR SET IT TO NULL)
	req.session.destroy((err) => {
		if (err) {
			console.log('err in destroy() in postLogout:', err);
		}
		res.redirect('/');
	});
};

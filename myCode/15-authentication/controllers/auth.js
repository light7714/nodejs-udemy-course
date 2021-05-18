const User = require('../models/user');

exports.getLogin = (req, res, next) => {
	//*We see true on sending different requests (going to diff pages) even though each req is technically separate from each other.
	//*Thats why if we open a new browser, we'll see undefined logged here.
	// console.log('Logged In:', req.session.isLoggedIn);
	res.render('auth/login', {
		path: '/login',
		pageTitle: 'Login',
		//as this page will only be shown when the user is not authenticated, thats why always passing false here
		isAuthenticated: false,
	});
};

exports.getSignup = (req, res, next) => {
	res.render('auth/signup', {
		path: '/signup',
		pageTitle: 'Signup',
		isAuthenticated: false,
	});
};

//here,a session will be created with an id, a cookie having the specific session id (hashed) will be created
exports.postLogin = (req, res, next) => {
	//this id inside is the one I got from mongoDb compass
	User.findById('609d9986e4eeef7603fb5189')
		.then((user) => {
			//session obj added by the session middleware in app.js, can add any key we want here.
			//*A new cookie connect.sid is set in browser, with a value of hashed session id. By default its session cookie (session here means it'll expire after closing browser (browser dependent))
			req.session.isLoggedIn = true;
			//* req.session.user is not a mongoose object, just plain object. https://stackoverflow.com/questions/18512461/express-cookiesession-and-mongoose-how-can-i-make-request-session-user-be-a-mon/18662693#18662693
			req.session.user = user;

			//*normally no need of writing session.save(), it'll automatically get saved in mongodb using the mongodb store, but as saving is async operation and we need to do redirect after saving, thats why doing writing save() method
			req.session.save((err) => {
				if (err) {
					console.log(
						'err in session.save() in postLogin in auth.js:',
						err
					);
				}
				//*whenever any response is sent, the session cookie will be sent along with it, so even if we do res.send(); the cookie will be sent
				res.redirect('/');
			});
		})
		.catch((err) => console.log('err in findById in auth.js:', err));
};

exports.postSignup = (req, res, next) => {};

//* this will remove the session (logout button on nav bar)
exports.postLogout = (req, res, next) => {
	//destroy method by express-session package, the fn inside will be called when the session is destroyed
	//*after destroying, the session cookie still exists in browser, but its no prob as the session is deleted, the cookie with new session id will be set after logging in again
	req.session.destroy((err) => {
		if (err) {
			console.log('err in destroy() in postLogout:', err);
		}
		res.redirect('/');
	});
};


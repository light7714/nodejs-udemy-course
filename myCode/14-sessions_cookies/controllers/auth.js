const User = require('../models/user');

exports.getLogin = (req, res, next) => {
	//*header name is cookie (as seen in browser in network tab in the req sent)
	// console.log(req.get('Cookie').trim().split('=')[1]);
	//*split(';') added cus if we get multiple cookies (due to extensions) then we need to split all of them and add the number where our cookie is located (trim to remove whitespaces)
	//we'll get true in text form, checking if it is equal to text true, then isLoggedIn will be bool true, otherwise bool false
	// const isLoggedIn =
	// req.get('Cookie').split(';')[0].trim().split('=')[1] === 'true';

	//*remember when the server reloads (nodemon) then this session will be lost here, as its stored in memory rn, and a new session will be created. thats why it will log undefined after server has reloaded, and true after logging in when server has not reloaded.
	//*After storing it in mongodb, it wont be lost, will show true even after reopening browser.
	//*We see true on sending different requests (going to diff pages) even though each req is technically separate from each other.
	//*Thats why if we open a new browser, we'll see undefined logged here.
	console.log('Logged In:', req.session.isLoggedIn);
	res.render('auth/login', {
		path: '/login',
		pageTitle: 'Login',
		//when isAuthenticated is true, the user related links (admin links, add to cart, cart, orders) will be shown
		//as this page will only be shown when the user is not authenticated, thats why always passing false here
		isAuthenticated: false,
	});
};

// exports.postLogin = (req, res, next) => {
//     //*WRONG WAY (SEE README) (as req obj doesnt persist, it ends after a response is sent)

// 	//*as its just a dummy auth flow rn (just for showing cookies), we dont get the login data here, we just assume the user is logged in (so empty data will work too)

// 	//storing whether user is logged in or not in the request obj, when not logged in the value of the variable will be undefined (treated as false in a check)
// 	//*we need to pass something to the views (navigation) so that if the user is logged in, then show those admin related links, otherwise not.
// // So passed ```isAuthenticated: req.isLoggedIn``` in every controller which renders a view.
// 	req.isLoggedIn = true;
// 	res.redirect('/');
// };

// exports.postLogin = (req, res, next) => {
// 	//*setting a cookie. 'Set-Cookie' is a reserved name, 2nd arg is value of that header. value for set-cookie is any key value pair
// 	//*Express 4 docs: " res.setHeader('Set-Cookie', val) Functionality is now limited to setting the basic cookie value. Use res.cookie() for added functionality."

// 	//*rn the expiration date is session, so it'll expire once we close the browser, if we dont want that, we can set an expiration date (in http date format) like this: res.setHeader('Set-Cookie', 'loggedIn=true; Expires={httpDateFormat}')
// 	//*we can also set it to expire after certain seconds, with Max-Age: res.setHeader('Set-Cookie', 'loggedIn=true; Max-Age=10')
// 	//*Can also specify domain to which cookie can be sent with Domain={someDomain}
// 	//*can set Secure (without any value), means the cookie will be set only when page is served via https (so we wont see cookie rn as we dont have https)
// 	//*can set HttpOnly key (without value), means we cant access the cookie value through client side scripts, an imp security mech as it protects from cross site scripting attacks (but still can see it manually)

// 	//But often we dont directly set our own cookies, we rather use some packages

// 	//*after setting cookie on browser, the browser also sends the cookie back to the server with every request
// 	// **But** the user can go to dev tools on browser and change the cookie from false to true, to gain access.. SO while cookies are generally a nice thing for storing data across requests, we shouldnt store sensitive data there. Sessions can help here.

// 	res.setHeader('Set-Cookie', 'loggedIn=true; HttpOnly');

// 	res.redirect('/');
// };

exports.postLogin = (req, res, next) => {
	//this id inside is the one I got from mongoDb compass
	User.findById('609d9986e4eeef7603fb5189')
		.then((user) => {
			//session obj added by the session middleware in app.js, can add any key we want here.
			//*A new cookie connect.sid is set in browser, with a value of a long string (encrypted value). By default its session cookie (session here means it'll expire after closing browser)
			//remember when the server reloads (nodemon) then this session will be lost here, as its stored in memory rn, and a new session will be created. New session cookie will be set.
			//*After storing it in mongodb, it wont be lost, will show true even after reopening browser
			//*if we click login button twice, still another session wont be added

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
				res.redirect('/');
			});
		})
		.catch((err) => console.log('err in findById in auth.js:', err));
};

//*rn this will remove the session (logout button on nav bar)
exports.postLogout = (req, res, next) => {
	//destory method by express-session package, the fn inside will be called when the session is destroyed
	//*after destorying, the session cookie still exists in browser, but its no prob as the session is deleted, the cookie with new session id will be set after logging in again
	req.session.destroy((err) => {
		if (err) {
			console.log('err in destroy() in postLogout:', err);
		}
		res.redirect('/');
	});
};

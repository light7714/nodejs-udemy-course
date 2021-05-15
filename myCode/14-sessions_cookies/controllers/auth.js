exports.getLogin = (req, res, next) => {
	//*header name is cookie (as seen in browser in network tab in the req sent)
	// console.log(req.get('Cookie').trim().split('=')[1]);
	//*split(';') added cus if we get multiple cookies (due to extensions) then we need to split all of them and add the number where our cookie is located
	//we'll get true in text form, checking if it is equal to text true, then isLoggedIn will be bool true, otherwise bool false
	const isLoggedIn =
		req.get('Cookie').split(';')[0].trim().split('=')[1] === 'true';

	res.render('auth/login', {
		path: '/login',
		pageTitle: 'Login',
		//when isLoggedIn is true, the admin links will be shown
		//*rn isLoggedIn is in text, and text is always true
		isAuthenticated: isLoggedIn,
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

exports.postLogin = (req, res, next) => {
	//*setting a cookie. 'Set-Cookie' is a reserved name, 2nd arg is value of that header. value for set-cookie is any key value pair
	//*Express 4 docs: " res.setHeader('Set-Cookie', val) Functionality is now limited to setting the basic cookie value. Use res.cookie() for added functionality."

	//*rn the expiration date is session, so it'll expire once we close the browser, if we dont want that, we can set an expiration date (in http date format) like this: res.setHeader('Set-Cookie', 'loggedIn=true; Expires={httpDateFormat}')
	//*we can also set it to expire after certain seconds, with Max-Age: res.setHeader('Set-Cookie', 'loggedIn=true; Max-Age=10')
	//*Can also specify domain to which cookie can be sent with Domain={someDomain}
	//*can set Secure (without any value), means the cookie will be set only when page is served via https (so we wont see cookie rn as we dont have https)
	//*can set HttpOnly key (without value), means we cant access the cookie value through client side scripts, an imp security mech as it protects from cross site scripting attacks

	//But often we dont directly set our own cookies, we rather use some packages

	//*after setting cookie on browser, the browser also sends the cookie back to the server with every request
	// **But** the user can go to dev tools on browser and change the cookie from false to true, to gain access.. SO while cookies are generally a nice thing for storing data across requests, we shouldnt store sensitive data there. Sessions can help here.

	res.setHeader('Set-Cookie', 'loggedIn=true; HttpOnly');

	res.redirect('/');
};

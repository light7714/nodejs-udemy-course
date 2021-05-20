//this fn will be passed in the routes, and then if user is logged in, the next, actual controller function will execute (see routes)
module.exports = (req, res, next) => {
	//if user is not logged in, then we dont wanna show some pages (as user can manually enter route)
	if (!req.session.isLoggedIn) {
		console.log('User is not logged in');
		return res.redirect('/login');
	}

	//if logged in, we want control to be continued to next middleware
	next();
};

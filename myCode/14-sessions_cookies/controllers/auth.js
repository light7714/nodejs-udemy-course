exports.getLogin = (req, res, next) => {
	res.render('auth/login', {
		path: '/login',
		pageTitle: 'Login',
		isAuthenticated: req.isLoggedIn,
	});
};

exports.postLogin = (req, res, next) => {
    //*WRONG WAY (SEE README)

	//*as its just a dummy auth flow rn (just for showing cookies), we dont get the login data here, we just assume the user is logged in (so empty data will work too)

	//storing whether user is logged in or not in the request obj, when not logged in the value of the variable will be undefined (treated as false in a check)
	//*we need to pass something to the views (navigation) so that if the user is logged in, then show those admin related links, otherwise not. So passed that in every controller which renders a view.
	req.isLoggedIn = true;
	res.redirect('/');
};

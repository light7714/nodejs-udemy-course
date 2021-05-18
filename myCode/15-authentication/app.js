const path = require('path');
const process = require('process');

const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
//*require() gives a fn here, to which we pass our session, MongoDBStore is a constructor fn
const MongoDBStore = require('connect-mongodb-session')(session);
const csrf = require('csurf');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const authRoutes = require('./routes/auth');
const rootDir = require('./util/path');
const errorController = require('./controllers/error');

const User = require('./models/user');

const app = express();
const PORT = 8000;
const PASSWORD = 'shubham1234';
const MONGODB_URI = `mongodb+srv://shubham_temp:${PASSWORD}@cluster0.b6e3a.mongodb.net/shop?retryWrites=true&w=majority`;

//it needs to know where to store our data, so passing uri
const store = new MongoDBStore({
	uri: MONGODB_URI,
	collection: 'sessions',
	//can also set expire key (it sets one by default)
});

//can pass js obj with config options, like storing the key value (with which hashing is done) on the cookie instead of the session (default)..
//*csrfProtection can now be used as a middleware
const csrfProtection = csrf();

//*solution to queries and outputs being logged twice in console, as browser again sends a request when it doesnt find favicon
app.get('/favicon.ico', (req, res) => res.sendStatus(204));

app.set('view engine', 'ejs');
app.set('views', 'views');

app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(rootDir, 'public')));
//session imported was a fn
//*secret is used for signing the hash which stores id of session in the cookie, can pass anything (should be a long string).
//resave: false means session wont be saved on every req received, but only if something changed in the session (improves performance)
//"saveUninitialized is for saving sessions that are new, but have not been modified. If you set it to false then empty sessions won't be stored in the database."       ???
//*matches session with cookie if present
app.use(
	session({
		secret: 'my secret',
		resave: false,
		saveUninitialized: false,
		//now the session cookie will also be stored in mongodb
		store: store,
		//can also configure the session cookie here
		// cookie{expires: }	cookie{maxAge: }
	})
);

//*this middleware comes after initiliasing the session, as it uses the session
app.use(csrfProtection);

app.use((req, res, next) => {
	//* req.session.user added after login (auth.js), it is not a mongoose object, just plain object
	if (!req.session.user) {
		return next();
	}
	//mongoose static method findById
	User.findById(req.session.user._id)
		.then((user) => {
			//*created a new user field in the request, now whenever we call req.user anywhere in controllers (registered below), we'll get the user
			//*user here is mongoose obj (doc) with all methods, found using req.session.user, which was not a full mongoose obj
			req.user = user;
			next();
		})
		.catch((err) => {
			console.log('err in findById() in app.js:', err);
		});
});

//*location is imp
//*We need to pass isAuthenticated and csrfToken variables in every view
app.use((req, res, next) => {
	//*locals field on response obj allows us to set local variables that are always passed into the views (local as they'll only exist in views that are rendered)
	res.locals.isAuthenticated = req.session.isLoggedIn;
	//method provided by csrf middleware
	res.locals.csrfToken = req.csrfToken();
	next();
});

app.use('/admin', adminRoutes);
app.use(shopRoutes);
app.use(authRoutes);
app.use(errorController.get404);

//these options set to remove all warnings, see depreciation docs
mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
mongoose.set('useUnifiedTopology', true);

//connecting to mongodb atlas here only, no need of a database.js file
mongoose
	.connect(MONGODB_URI)
	.then((result) => {
		//*earlier here we created user too if it didnt exist, but now we have user creation flow in signup
		app.listen(PORT, () => {
			console.log(`Listening on port ${PORT}`);
		});
	})
	.catch((err) => {
		console.log('err in mongoose.connect in app.js:', err);
	});

//sometimes process keeps on running even after ctrl+c (dunno why), thats why added this (still not solved..???)
process.on('SIGINT', () => {
	console.log('\nShutting down');
	process.exit(1);
});

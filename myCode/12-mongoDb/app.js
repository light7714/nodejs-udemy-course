const path = require('path');

const express = require('express');
// const bodyParser = require('body-parser');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const rootDir = require('./util/path');
const errorController = require('./controllers/error');
const mongoConnect = require('./util/database').mongoConnect;

const User = require('./models/user');

const app = express();

const PORT = 8000;

app.set('view engine', 'ejs');
app.set('views', 'views');

// app.use(bodyParser.urlencoded({ extended: false }));	//old way
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(rootDir, 'public')));

app.use((req, res, next) => {
	//*right now a user has been created behind the scenes in mongodb compass, so we only need to assume here that a user has already been created with an _id attrubute

	//this id inside is the one I got from mongoDb compass
	User.findById('60981bbed5c8c01f2072b102')
		.then((user) => {
			//**created a new user field in the request, now whenever we call req.user anywhere in controllers (registered below), we'll get the user
			//*when we'll retreive the _id anywhere, we'll get string, not ObjectId
			//user here is just data from db, with no methods of our user model
			// req.user = user;

			//*To have a real user model (with its methods) so we can interact with it, we do
			req.user = new User(user.name, user.email, user.cart, user._id);
			next();
		})
		.catch((err) => {
			console.log('err in app.use in app.js:', err);
		});
});

//solution to queries and outputs being logged twice in console, as browser again sends a request when it doesnt find favicon
app.get('/favicon.ico', (req, res) => res.sendStatus(204));

app.use('/admin', adminRoutes);
app.use(shopRoutes);
app.use(errorController.get404);

//mongoConnect is for connecting and then storing the connection to the db. it'll be called in app.js, so it'll keep running (the connection is running, as we stored it), we dont have to connect everytime.
//calback will be executed after connection to mongodb is made
mongoConnect(() => {
	app.listen(PORT, () => {
		console.log(`Listening on port ${PORT}`);
	});
});

const path = require('path');

const express = require('express');
const mongoose = require('mongoose');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const rootDir = require('./util/path');
const errorController = require('./controllers/error');

// const User = require('./models/user');

const app = express();

const PORT = 8000;

app.set('view engine', 'ejs');
app.set('views', 'views');

app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(rootDir, 'public')));
const PASSWORD = 'shubham1234';

// app.use((req, res, next) => {
// 	//*right now a user has been created behind the scenes in mongodb compass, so we only need to assume here that a user has already been created with an _id attrubute

// 	//this id inside is the one I got from mongoDb compass
// 	User.findById('60981bbed5c8c01f2072b102')
// 		.then((user) => {
// 			//**created a new user field in the request, now whenever we call req.user anywhere in controllers (registered below), we'll get the user
// 			//*when we'll retreive the _id anywhere, we'll get string, not ObjectId
// 			//user here is just data from db, with no methods of our user model
// 			// req.user = user;

// 			//*To have a real user model (with its methods) so we can interact with it, we do
// 			req.user = new User(user.name, user.email, user.cart, user._id);
// 			next();
// 		})
// 		.catch((err) => {
// 			console.log('err in app.use in app.js:', err);
// 		});
// });

//solution to queries and outputs being logged twice in console, as browser again sends a request when it doesnt find favicon
app.get('/favicon.ico', (req, res) => res.sendStatus(204));

app.use('/admin', adminRoutes);
app.use(shopRoutes);
app.use(errorController.get404);

//these options set to remove all warnings, see depreciation docs, can also pass these in mongoose.connect()
mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
mongoose.set('useUnifiedTopology', true);

//connecting to mongodb atlas here only, no need of a database.js file
mongoose
	.connect(
		`mongodb+srv://shubham_temp:${PASSWORD}@cluster0.b6e3a.mongodb.net/shop?retryWrites=true&w=majority`
	)
	.then((result) => {
		app.listen(PORT, () => {
			console.log(`Listening on port ${PORT}`);
		});
	})
	.catch((err) => {
		console.log('err in mongoose.connect in app.js:', err);
	});

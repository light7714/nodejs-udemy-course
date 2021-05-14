const path = require('path');
const process = require('process');

const express = require('express');
const mongoose = require('mongoose');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const authRoutes = require('./routes/auth');
const rootDir = require('./util/path');
const errorController = require('./controllers/error');

const User = require('./models/user');

const app = express();

const PORT = 8000;

app.set('view engine', 'ejs');
app.set('views', 'views');

app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(rootDir, 'public')));
const PASSWORD = 'shubham1234';

app.use((req, res, next) => {
	//this id inside is the one I got from mongoDb compass
	//mongoose static method findById
	User.findById('609d9986e4eeef7603fb5189')
		.then((user) => {
			//*created a new user field in the request, now whenever we call req.user anywhere in controllers (registered below), we'll get the user
			//user is mongoose obj (doc) with all methods
			req.user = user;
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
app.use(authRoutes);
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
	//user doc will be saved in the starting only rn, _id and __v attribs added automatically
	.then((result) => {
		//*mongoose static findOne() gives the 1st doc by default
		User.findOne()
			.then((user) => {
				if (!user) {
					const user = new User({
						name: 'Shubham',
						email: 'shubhamlightning99@gmail.com',
						cart: {
							items: [],
						},
					});
					user.save();
				}
			})
			.catch((err) => {
				console.log('err in User.findOne() in app.js:', err);
			});

		app.listen(PORT, () => {
			console.log(`Listening on port ${PORT}`);
		});
	})
	.catch((err) => {
		console.log('err in mongoose.connect in app.js:', err);
	});

//sometimes process keeps on running even after ctrl+c (dunno why), thats why added this
process.on('SIGINT', () => {
	console.log('\nShutting down');
	process.exit(1);
});

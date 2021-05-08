const path = require('path');

const express = require('express');
// const bodyParser = require('body-parser');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const rootDir = require('./util/path');
const errorController = require('./controllers/error');
const mongoConnect = require('./util/database').mongoConnect;

const app = express();

const PORT = 8000;

app.set('view engine', 'ejs');
app.set('views', 'views');

// app.use(bodyParser.urlencoded({ extended: false }));	//old way
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(rootDir, 'public')));

// app.use((req, res, next) => {
// 	User.findByPk(1)
// 		.then((user) => {
// 			//**created a new user field in the request, now whenever we call req.user anywhere in controllers (registered below), we'll get the user
// 			req.user = user;
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


//mongoConnect is for connecting and then storing the connection to the db. it'll be called in app.js, so it'll keep running (the connection is running, as we stored it), we dont have to connect everytime.
mongoConnect(() => {
	app.listen(PORT, () => {
		console.log(`Listening on port ${PORT}`);
	});
});


//rn now user obj is passed to controllers (like in sequelize module, re.user was passed), we'll add that later
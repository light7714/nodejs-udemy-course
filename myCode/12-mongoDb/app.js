const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');

// const adminRoutes = require('./routes/admin');
// const shopRoutes = require('./routes/shop');
const rootDir = require('./util/path');
const errorController = require('./controllers/error');
const mongoConnect = require('./util/database');

const app = express();

const PORT = 8000;

app.set('view engine', 'ejs');
app.set('views', 'views');

app.use(bodyParser.urlencoded({ extended: false }));
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

// app.use('/admin', adminRoutes);
// app.use(shopRoutes);
app.use(errorController.get404);

//passing callback fn which will be executed after connected to mongodb atlas, it receives the client obj
mongoConnect((client) => {
	console.log(client);
	app.listen(PORT, () => {
		console.log(`Listening on port ${PORT}`);
	});
});
const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const rootDir = require('./util/path');
const errorController = require('./controllers/error');
const sequelize = require('./util/database');

const Product = require('./models/product');
const User = require('./models/user');

const app = express();

const PORT = 8000;

app.set('view engine', 'ejs');
app.set('views', 'views');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(rootDir, 'public')));

//registering a new middleware here
app.use((req, res, next) => {
	
	//* the user is created below in code in User.create(), but when the code runs, this middleware only gets registered, then the code runs where we create a user, after that only we start listening to requests. So we'll always get a user here, when any req is sent
	User.findByPk(1)
		.then((user) => {
			//we can create new fields in req, just dont use names already used (like req.body)
			//*created a new user field in the request, now whenever we call req.user anywhere in controllers (registered below), we'll get the user
			//user is a sequelize object here (so we can call sequelize methods on it), not a js obj
			req.user = user;
			next();
		})
		.catch((err) => {
			console.log('err in app.use in app.js:', err);
		});
});

app.use('/admin', adminRoutes);
app.use(shopRoutes);
app.use(errorController.get404);

//defining data relations b/w models (see more in docs)
//this means a user created a product, 2nd arg is options
//onDelete: 'CASCADE' means if user is deleted, the product related to that user is also deleted
//* constraints: true simply enforces the rule that the userId foreign key in the Products table must reference a key from the Users table and no other table. (a fk with name userId is automatically created in product table, which references id in user table)
Product.belongsTo(User, { constraints: true, onDelete: 'CASCADE' });
//hasMany is inverse of belongsTo, it is optional to write here, but writing it here to really make it clear how this relation works.
User.hasMany(Product);

//sync is aware of all models we defined (like in product model we used sequelize.define()) and it then creates tables for them, so it syncs our models to the db by creating appropriate tables and relations
//it only creates tables if they dont exist, else just remaps to those tables (tho we can tell it to make new table each time (see docs maybe))
//automatically makes model name (in define fn) as plural in table name, so product model is named as products in table, while products is kept same
//also manages timestamps automatically, so we see 2 new columns in table, createdAt, updatedAt.. we coould disable this tho
//* in short, sync creates tables and relations for the models we defined (sequelize.define()), but remaps to old tables if they exist

//*setting force: true as when relations were added in code, product table already existed, so this setting overrides the table with new info. We dont use it in production as we dont always want to overwrite tables. so I only set it true once, when making relations, and then removed it, otherwise all tables will be dropped and newly made each time
sequelize
	// .sync({force: true})
	.sync()
	.then((result) => {
		//*dummy code to see if i have one user (as we only need 1 for now cuz no auth). If we do have 1 user, not creating a new user, otherwise creating
		return User.findByPk(1);

		//*we see the executed query in console even if result is not logged
		// console.log(result);
	})
	.then((user) => {
		if (!user) {
			return User.create({
				name: 'Shubham',
				email: 'shubhamlightning99@gmail.com',
			});
		}

		//*in the if block above, we return a promise, so we also need to return a promise outside if block instead of just user to chain then block. so Promise.resolve(user) is a promise that immediately resolves to user
		// return Promise.resolve(user);

		//* tho technically we can just return user, as anything return in a then block is wrapped into a new promise automatically
		return user;
	})
	.then((user) => {
		// console.log(user);
		app.listen(PORT, () => {
			console.log(`Listening on port ${PORT}`);
		});
	})
	.catch((err) => {
		console.log('err in promise in app.js:', err);
	});

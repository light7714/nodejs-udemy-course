const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const rootDir = require('./util/path');
const errorController = require('./controllers/error');
const sequelize = require('./util/database');

const app = express();

const PORT = 8000;

app.set('view engine', 'ejs');
app.set('views', 'views');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(rootDir, 'public')));

app.use('/admin', adminRoutes);
app.use(shopRoutes);
app.use(errorController.get404);

//sync is aware of all models we defined (like in product model we used sequelize.define()) and it then creates tables for them, so it syncs our models to the db by creating appropriate tables and relations
//it only creates tables if they dont exist, else just remaps to those tables (tho we can tell it to make new table each time (see docs maybe))
//automatically makes model name (in define fn) as plural in table name, so product model is named as products in table, while products is kept same
//only starting server if we somehow made it into then() block (so when db is ready)
//also manages timestamps automatically, so we see 2 new columns in table, createdAt, updatedAt.. we coould disable this tho
//* in short, sync creates tables and relations for the models we defined (sequelize.define()), but remaps to old tables if they exist
sequelize
	.sync()
	.then((result) => {
		//*we see the executed query in console even if result is not logged
		// console.log(result);
		app.listen(PORT, () => {
			console.log(`Listening on port ${PORT}`);
		});
	})
	.catch((err) => {
		console.log('err in promise in app.js:', err);
	});

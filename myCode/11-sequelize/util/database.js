//code to allow us to connect to the mysql db

const Sequelize = require('sequelize');

//have to pass some options like db name, username to configure it, password, and an options obj
//Sequelize can be used for different sql engines, so we have to pass dialect as mysql when configuring it, it'll set up a connection pool
//host is by default localhost, but setting it explictly here
const sequelize = new Sequelize(
	'node-complete',
	'shubham_temp',
	'shubham@1234',
	{ dialect: 'mysql', host: 'localhost' }
);

//exporting a sequelize environment (with data connection pool) managed by sequelize
module.exports = sequelize;

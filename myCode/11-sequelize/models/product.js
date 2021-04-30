const { Sequelize } = require('sequelize');

const sequelize = require('../util/database');

//not creating a class, but making a new model in the sequelize environment
//1st arg is model name, 2nd model defines the structure of our model and automatically created db table
//types are not like in mysql(like varchar or number), but like INTEGER and STRING. See docs for more details
const Product = sequelize.define('product', {
	id: {
		type: Sequelize.INTEGER,
		autoIncrement: true,
		allowNull: false,
		primaryKey: true,
	},
	//this is shortcut if u wanna just assign type
	// title: Sequelize.STRING
	title: {
		type: Sequelize.STRING,
		allowNull: false,
	},
	price: {
		type: Sequelize.DOUBLE,
		allowNull: false,
	},
	imageUrl: {
		type: Sequelize.STRING,
		allowNull: false,
	},
	description: {
		type: Sequelize.STRING,
		allowNull: false,
	},
});

module.exports = Product;

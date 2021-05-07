//this model (or table) holds the different carts for different users
//so each row in this table is a cart for a user. This doesnt hold to products in cart for each user.

const Sequelize = require('sequelize');

const sequelize = require('../util/database');

const Cart = sequelize.define('cart', {
	id: {
		type: Sequelize.INTEGER,
		autoIncrement: true,
		allowNull: false,
		primaryKey: true,
	},
});

module.exports = Cart;

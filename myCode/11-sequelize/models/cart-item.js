// This holds to products in cart for each user.
//each cart item contains a product, id of the cart in which the product lies, and the quantity

const Sequelize = require('sequelize');

const sequelize = require('../util/database');

//id of the cart to which each item is related is not added by us, it will be done by sequelize after we define relations
const CartItem = sequelize.define('cartItem', {
	id: {
		type: Sequelize.INTEGER,
		autoIncrement: true,
		allowNull: false,
		primaryKey: true,
	},
    quantity: Sequelize.INTEGER
});

module.exports = CartItem;

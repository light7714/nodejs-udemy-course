//model for an order (checking out products in cart for a user)
//order is somewhat like cart
//there will be different products in each order, order-items stores that (each row having one product of each user)

const Sequelize = require('sequelize');

const sequelize = require('../util/database');

const Order = sequelize.define('order', {
	id: {
		type: Sequelize.INTEGER,
		autoIncrement: true,
		allowNull: false,
		primaryKey: true,
	},
});

module.exports = Order;

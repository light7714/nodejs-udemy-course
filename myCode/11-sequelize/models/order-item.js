//orderItem is just like cartItem
//*OrderItem will contain an id, quantity (which we defined), a prodId and an orderId.
//there will be different products in each order, order-items stores that (each row having one product of each user)

const Sequelize = require('sequelize');

const sequelize = require('../util/database');

const OrderItem = sequelize.define('orderItem', {
	id: {
		type: Sequelize.INTEGER,
		autoIncrement: true,
		allowNull: false,
		primaryKey: true,
	},
    quantity: Sequelize.INTEGER
});

module.exports = OrderItem;

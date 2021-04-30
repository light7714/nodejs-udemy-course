//no auth for now, so making a dummy user who doesnt have to log in

const Sequelize = require('sequelize');

const sequelize = require('../util/database');

const User = sequelize.define('user', {
	id: {
		type: Sequelize.INTEGER,
		autoIncrement: true,
		allowNull: false,
		primaryKey: true,
	},
	name: Sequelize.STRING,
	email: Sequelize.STRING,
});

module.exports = User;

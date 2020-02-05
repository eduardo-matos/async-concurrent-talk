const Sequelize = require('sequelize');
const { DB_URL } = require('./config');

module.exports = new Sequelize(DB_URL, { logging: false });

const Sequelize = require('sequelize');

const sequelize = new Sequelize('first-mysql', "root", 'tt01051995', {
  dialect: 'mysql',
  host: 'localhost'
});

module.exports = sequelize;
const Sequelize = require('sequelize');
const sequelize = require('../util/database');

const CartItem = sequelize.define('cartItems', {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false, //not to empty
    primaryKey: true
  },
  quality: Sequelize.INTEGER
});

module.exports = CartItem;


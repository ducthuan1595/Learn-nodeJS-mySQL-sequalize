const mysql = require('mysql2');

const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  database: 'first-mysql',
  password: 'tt01051995'
});

module.exports = pool.promise();
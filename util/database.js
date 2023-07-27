const Sequelize = require('sequelize');
const mysql = require('mysql2');

const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: 'Mishra21@',
  database: 'bookingapp',
});

const sequelize = new Sequelize({
  dialect: 'mysql',
  database: 'bookingapp',
  username: 'root',
  password: 'Mishra21@',
  host: 'localhost',
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000,
  },
});

module.exports = sequelize;

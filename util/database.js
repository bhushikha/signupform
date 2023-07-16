const mysql = require('mysql2');

const pool = mysql.createPool({
    host: 'localhost', 
    user: 'root', 
    password: 'Mishra21@', 
    database: 'bookingapp', 
  });
  module.exports=pool; 
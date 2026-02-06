// db.js
const mysql = require('mysql2');

const connection = mysql.createConnection({
  host: 'localhost',       // Usually localhost
  user: 'root',            // Your MySQL username
  password: '',            // Your MySQL password
  database: 'localease'    // Your database name
});

connection.connect((err) => {
  if (err) {
    console.error('Error connecting to MySQL:', err.message);
  } else {
    console.log('Connected to MySQL database!');
  }
});

module.exports = connection;
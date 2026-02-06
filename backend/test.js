const connection = require('./config/db');

connection.query('SELECT * FROM users', (err, results) => {
  if (err) throw err;
  console.log('Users:', results);
  connection.end(); // Close connection
});

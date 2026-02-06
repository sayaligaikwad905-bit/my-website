const connection = require('../config/db');

exports.getServices = (req, res) => {
  connection.query('SELECT * FROM services', (err, results) => {
    if (err) return res.status(500).json(err);
    res.json(results);
  });
};

exports.createService = (req, res) => {
  const { name, price, description } = req.body;

  if (!name || !price)
    return res.status(400).json({ message: 'Name and price required' });

  const sql =
    'INSERT INTO services (name, price, description) VALUES (?, ?, ?)';

  connection.query(sql, [name, price, description], (err) => {
    if (err) return res.status(500).json(err);
    res.json({ message: 'Service created successfully' });
  });
};
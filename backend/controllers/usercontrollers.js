const connection = require('../config/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// REGISTER
exports.createUser = (req, res) => {
  const { name, email, password, role } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ message: 'All fields required' });
  }

  const hashedPassword = bcrypt.hashSync(password, 10);

  const sql =
    'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)';

  connection.query(
    sql,
    [name, email, hashedPassword, role || 'user'],
    (err) => {
      if (err) return res.status(500).json(err);
      res.json({ message: 'User registered successfully' });
    }
  );
};

// LOGIN
exports.loginUser = (req, res) => {
  const { email, password } = req.body;

  const sql = 'SELECT * FROM users WHERE email = ?';

  connection.query(sql, [email], (err, results) => {
    if (err) return res.status(500).json(err);
    if (results.length === 0)
      return res.status(401).json({ message: 'User not found' });

    const user = results[0];
    const isMatch = bcrypt.compareSync(password, user.password);

    if (!isMatch)
      return res.status(401).json({ message: 'Invalid password' });

    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    res.json({
      message: 'Login successful',
      token,
      role: user.role
    });
  });
};

// ADMIN: GET ALL USERS
exports.getAllUsers = (req, res) => {
  connection.query(
    'SELECT id,name,email,role FROM users',
    (err, results) => {
      if (err) return res.status(500).json(err);
      res.json(results);
    }
  );
};
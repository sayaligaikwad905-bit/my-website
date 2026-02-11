const connection = require('../config/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// ================= REGISTER =================
exports.createUser = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    // 1️⃣ Basic validation
    if (!name || !email || !password || !role) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    // 2️⃣ Email format check
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: 'Invalid email format' });
    }

    // 3️⃣ Role validation
    const allowedRoles = ['user', 'provider'];
    if (!allowedRoles.includes(role)) {
      return res.status(400).json({ message: 'Invalid role selected' });
    }

    // 4️⃣ Password rule
    if (password.length < 6) {
      return res
        .status(400)
        .json({ message: 'Password must be at least 6 characters' });
    }

    // 5️⃣ Hash password (ASYNC – SAFE)
    const hashedPassword = await bcrypt.hash(password, 10);

    const sql =
      'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)';

    connection.query(
      sql,
      [name, email, hashedPassword, role],
      (err) => {
        if (err) {
          console.error('REGISTER ERROR:', err);

          if (err.code === 'ER_DUP_ENTRY') {
            return res.status(409).json({ message: 'Email already exists' });
          }

          return res.status(500).json({ message: 'Database error' });
        }

        res.status(201).json({ message: 'User registered successfully' });
      }
    );
  } catch (error) {
    console.error('REGISTER CATCH ERROR:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// ================= LOGIN =================
exports.loginUser = async (req, res) => {
  try {
    const { email, password, role } = req.body;

    if (!email || !password || !role) {
      return res.status(400).json({ message: 'All fields required' });
    }

    const sql = 'SELECT * FROM users WHERE email = ?';

    connection.query(sql, [email], async (err, results) => {
      if (err) {
        console.error('LOGIN DB ERROR:', err);
        return res.status(500).json({ message: 'Database error' });
      }

      if (results.length === 0) {
        return res.status(401).json({ message: 'User not found' });
      }

      const user = results[0];

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(401).json({ message: 'Invalid password' });
      }

      if (user.role !== role) {
        return res.status(403).json({
          message: `You are registered as ${user.role}`
        });
      }

      const token = jwt.sign(
        { id: user.id, role: user.role },
        process.env.JWT_SECRET || 'localease_secret',
        { expiresIn: '1d' }
      );

      res.json({
        message: 'Login successful',
        token,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role
        }
      });
    });
  } catch (error) {
    console.error('LOGIN CATCH ERROR:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// ================= ADMIN =================
exports.getAllUsers = (req, res) => {
  connection.query(
    'SELECT id, name, email, role FROM users',
    (err, results) => {
      if (err) return res.status(500).json({ message: 'DB error' });
      res.json(results);
    }
  );
};
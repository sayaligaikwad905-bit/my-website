require('dotenv').config();
const express = require('express');
const path = require('path');
const cors = require('cors');
const app = express();

const userRoutes = require('./routes/userRoutes');
const serviceRoutes = require('./routes/serviceRoutes');
const bookingRoutes = require('./routes/bookingRoutes');

// Middleware
app.use(express.json());
app.use(cors());

// ✅ Serve static files from public folder
app.use(express.static(path.join(__dirname, 'public')));

// API Routes
app.use('/users', userRoutes);
app.use('/services', serviceRoutes);
app.use('/bookings', bookingRoutes);

app.get('/api', (req, res) => {
  res.send('Backend API running successfully');
});

// ✅ Serve index.html for all non-API routes (SPA support)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});
const connection = require('../config/db');

exports.getBookings = (req, res) => {
  const sql = `
    SELECT bookings.id,
           users.name AS user_name,
           services.name AS service_name,
           bookings.booking_date,
           bookings.status
    FROM bookings
    JOIN users ON bookings.user_id = users.id
    JOIN services ON bookings.service_id = services.id
  `;

  connection.query(sql, (err, results) => {
    if (err) return res.status(500).json(err);
    res.json(results);
  });
};

exports.createBooking = (req, res) => {
  const { user_id, service_id, booking_date } = req.body;

  if (!user_id || !service_id || !booking_date)
    return res.status(400).json({ message: 'All fields required' });

  const sql =
    'INSERT INTO bookings (user_id, service_id, booking_date, status) VALUES (?, ?, ?, ?)';

  connection.query(
    sql,
    [user_id, service_id, booking_date, 'pending'],
    (err) => {
      if (err) return res.status(500).json(err);
      res.json({ message: 'Booking created successfully' });
    }
  );
};
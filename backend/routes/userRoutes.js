const express = require("express");
const router = express.Router();
const db = require("../config/db");
const User = require("../models/user");

/* ================= REGISTER ================= */
router.post("/register", (req, res) => {
  const { name, email, password, role } = req.body;

  if (!name || !email || !password || !role) {
    return res.status(400).json({ message: "All fields are required" });
  }

  const newUser = new User(name, email, password, role);

  User.register(db, newUser, (err, result) => {
    if (err) return res.status(500).json({ message: "Database error" });

    if (result.error) {
      return res.status(409).json({ message: result.error });
    }

    res.status(201).json({ message: result.success });
  });
});

/* ================= LOGIN ================= */
router.post("/login", (req, res) => {
  const { email, password, role } = req.body;

  if (!email || !password || !role) {
    return res.status(400).json({ message: "All fields required" });
  }

  User.login(db, email, password, role, (err, result) => {
    if (err) return res.status(500).json({ message: "Database error" });

    if (result.error) {
      return res.status(401).json({ message: result.error });
    }

    res.json({
      message: result.success,
      token: "localEaseDummyToken123",
      user: result.user,
    });
  });
});
// ================= BOOK SERVICE =================
router.post("/book-service", (req, res) => {
    const { user_id, service_id, booking_date, booking_time } = req.body;

    if (!user_id || !service_id || !booking_date || !booking_time) {
        return res.status(400).json({ error: "All fields are required" });
    }

    // Convert AM/PM to 24-hour format
    function convertTo24Hour(time) {
        const [t, modifier] = time.split(" ");
        let [hours, minutes] = t.split(":");
        hours = parseInt(hours);
        if (modifier === "PM" && hours !== 12) hours += 12;
        if (modifier === "AM" && hours === 12) hours = 0;
        return `${hours.toString().padStart(2,"0")}:${minutes}:00`;
    }

    const booking_date_time = `${booking_date} ${convertTo24Hour(booking_time)}`;

    const query = `
        INSERT INTO bookings (user_id, service_id, booking_date, status)
        VALUES (?, ?, ?, ?)
    `;
    db.query(query, [user_id, service_id, booking_date_time, "Active"], (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: "Database error" });
        }
        res.json({ success: "Booking created successfully" });
    });
});
module.exports = router;
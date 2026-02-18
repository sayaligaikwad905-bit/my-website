const express = require("express");
const router = express.Router();
const db = require("../config/db");
const Booking = require("../models/booking");

// Get all bookings for a user
router.get("/user/:id", (req, res) => {
    const userId = req.params.id;

    Booking.getAllByUser(db, userId, (err, result) => {
        if (err) return res.status(500).json({ message: "Database error" }); // Experiment 3: error handling
        res.json(result);
    });
});

// Add a booking
router.post("/add", (req, res) => {
    const { userId, serviceName, date, status, amount } = req.body;

    Booking.addBooking(db, { userId, serviceName, date, status, amount }, (err, result) => {
        if (err) return res.status(500).json({ message: "Database error" }); // runtime handling
        res.json({ message: result.success });
    });
});

module.exports = router;
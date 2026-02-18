class Booking {
    constructor(userId, serviceName, date, status, amount) {
        this.userId = userId;
        this.serviceName = serviceName;
        this.date = date;
        this.status = status;
        this.amount = amount;
    }

    static getAllByUser(db, userId, callback) {
        db.query("SELECT * FROM bookings WHERE userId = ?", [userId], (err, result) => {
            if (err) return callback(err); // Experiment 3: runtime error handling
            callback(null, result);
        });
    }

    static addBooking(db, bookingData, callback) {
        const { userId, serviceName, date, status, amount } = bookingData;
        db.query(
            "INSERT INTO bookings (userId, serviceName, date, status, amount) VALUES (?, ?, ?, ?, ?)",
            [userId, serviceName, date, status, amount],
            (err) => {
                if (err) return callback(err); // Experiment 3: handle database errors
                callback(null, { success: "Booking added successfully" });
            }
        );
    }
}

module.exports = Booking;
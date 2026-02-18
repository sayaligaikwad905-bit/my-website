class User {
  constructor(name, email, password, role) {
    this.name = name;
    this.email = email;
    this.password = password;
    this.role = role;
  }

  static register(db, userData, callback) {
    const { name, email, password, role } = userData;

    db.query(
      "SELECT id FROM users WHERE email = ?",
      [email],
      (err, result) => {
        if (err) return callback(err);

        if (result.length > 0) {
          return callback(null, { error: "Email already registered" });
        }

        db.query(
          "INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)",
          [name, email, password, role],
          (err) => {
            if (err) return callback(err);

            callback(null, { success: "Registration successful" });
          }
        );
      }
    );
  }

  static login(db, email, password, role, callback) {
    db.query(
      "SELECT * FROM users WHERE email = ? AND password = ?",
      [email, password],
      (err, result) => {
        if (err) return callback(err);

        if (result.length === 0) {
          return callback(null, { error: "Invalid email or password" });
        }

        if (result[0].role !== role) {
          return callback(null, { error: "Incorrect role selected" });
        }

        callback(null, {
          success: "Login successful",
          user: result[0],
        });
      }
    );
  }
}

module.exports = User;
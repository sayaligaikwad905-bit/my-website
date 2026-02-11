const bcrypt = require("bcryptjs");
const db = require("../config/db");

exports.login = (req, res) => {
  // 1. Get credentials from frontend
  const { email, password, role } = req.body;

  // 2. Convert role to lowercase to match your MySQL ENUM ('admin', 'provider', 'user')
  const formattedRole = role.toLowerCase();

  console.log(`Attempting login for: ${email} with role: ${formattedRole}`);

  // 3. Query the database
  db.query(
    "SELECT * FROM users WHERE email = ? AND role = ?",
    [email, formattedRole],
    async (err, results) => {
      if (err) {
        // This will print the exact MySQL error in your VS Code terminal
        console.error("❌ MySQL Error:", err);
        return res.status(500).json({ message: "DB error", error: err.message });
      }

      // 4. Check if user exists
      if (results.length === 0) {
        return res.status(401).json({ message: "Invalid email or role" });
      }

      const user = results[0];

      try {
        // 5. Check password (only works if hashed during registration)
        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
          return res.status(401).json({ message: "Invalid password" });
        }

        // 6. Success
        console.log("✅ Login successful for:", email);
        res.status(200).json({
          message: "Login successful",
          user: {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role
          }
        });

      } catch (bcryptErr) {
        console.error("❌ Bcrypt Error:", bcryptErr);
        res.status(500).json({ message: "Error verifying password" });
      }
    }
  );
};
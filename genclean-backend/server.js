// server.js
require("dotenv").config();
const express = require("express");
const path = require("path");
const { Pool } = require("pg");
const cors = require("cors");
const bodyParser = require("body-parser");
const bcrypt = require("bcrypt");
const { sendOTP, verifyOTP } = require("./otpController.js");

const app = express();
const PORT = 3007;

const requireAuth = require("./authMiddleware");

app.get("/api/customer-dashboard", requireAuth, (req, res) => {
  res.json({ message: "Welcome to your dashboard, " + req.user.email });
});


app.use(cors());
app.use(bodyParser.json());

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

pool.connect()
  .then(() => console.log("✅ Connected to Supabase PostgreSQL"))
  .catch((err) => console.error("❌ Database error:", err));


// ======================= REGISTER =======================
app.post("/register", async (req, res) => {
  const { firstName, lastName, phoneNumber, emailAdd, password } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const query = `
      INSERT INTO users (first_name, last_name, phone_number, email, password)
      VALUES ($1, $2, $3, $4, $5)
    `;
    await pool.query(query, [
      firstName,
      lastName,
      phoneNumber,
      emailAdd,
      hashedPassword,
    ]);

    res.status(200).send("Registered successfully");
  } catch (err) {
    console.error("Error inserting:", err);
    res.status(500).send("Error registering user");
  }
});


// ======================= LOGIN =======================
// ======================= LOGIN =======================
const jwt = require("jsonwebtoken");
const SECRET = process.env.JWT_SECRET || "yoursecret";

app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const result = await pool.query("SELECT * FROM users WHERE email = $1", [email]);

    if (result.rows.length === 0) {
      return res.status(400).json({ message: "User not found" });
    }

    const user = result.rows[0];
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ message: "Invalid password" });
    }

    // 🔹 Generate JWT token
    const token = jwt.sign(
      { id: user.id, email: user.email },
      SECRET,
      { expiresIn: "1h" } // expires in 1 hour
    );

    // 🔹 Return token + user info
    res.status(200).json({
      message: "Login successful",
      token,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.first_name,
        lastName: user.last_name,
        phoneNumber: user.phone_number,
      },
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// ======================= ADMIN LOGIN =======================
app.post("/admin-login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const result = await pool.query(`SELECT * FROM "Admins" WHERE email = $1`, [email]);

    if (result.rows.length === 0) {
      return res.status(400).json({ message: "Admin not found" });
    }

    const admin = result.rows[0];
    const isMatch = await bcrypt.compare(password, admin.password_hash);

    if (!isMatch) {
      return res.status(400).json({ message: "Invalid password" });
    }

    res.status(200).json({
      message: "Admin login successful",
      user: {
        id: admin.id,
        email: admin.email,
        username: admin.user_name,
        createdAt: admin.created_at,
      },
    });
  } catch (err) {
    console.error("Admin login error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// ======================= ADMIN REGISTER (one-time setup) =======================
app.post("/admin-register", async (req, res) => {
  const { userName, email, password } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const query = `
      INSERT INTO "Admins" (user_name, email, password_hash)
      VALUES ($1, $2, $3)
    `;
    await pool.query(query, [userName, email, hashedPassword]);

    res.status(200).send("Admin registered successfully");
  } catch (err) {
    console.error("Error inserting admin:", err);
    res.status(500).send("Error registering admin");
  }
});




// ======================= BOOKING =======================
app.post("/booking", async (req, res) => {
  const { userId, service, date, address, notes, forAssessment } = req.body;

  try {
    // 1. Get the user's first + last name
    const userResult = await pool.query(
      "SELECT first_name, last_name FROM users WHERE id = $1",
      [userId]
    );

    if (userResult.rows.length === 0) {
      return res.status(400).json({ message: "User not found" });
    }

    const user = userResult.rows[0];
    const fullName = `${user.first_name} ${user.last_name}`;

    // 2. Insert booking with the full name
    const query = `
      INSERT INTO bookings (user_id, name, service, booking_date, address, notes, for_assessment)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
    `;
    await pool.query(query, [
      userId,
      fullName,
      service,
      date,
      address,
      notes,
      forAssessment,
    ]);

    res.status(200).send("Booking successful");
  } catch (err) {
    console.error("Error inserting booking:", err);
    res.status(500).send("Error booking service");
  }
});


// ======================= OTP =======================
app.post("/send-otp", sendOTP);
app.post("/verify-otp", verifyOTP);


// ======================= FRONTEND SERVE =======================
app.use(express.static(path.join(__dirname, "../dist")));

app.get(/.*/, (req, res) => {
  res.sendFile(path.join(__dirname, "../dist/index.html"));
});


// ======================= SERVER START =======================
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});

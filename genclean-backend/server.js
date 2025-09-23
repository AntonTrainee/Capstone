// server.js
require("dotenv").config();
const express = require("express");
const { Pool } = require("pg");
const cors = require("cors");
const bodyParser = require("body-parser");
const bcrypt = require("bcrypt");
const { sendOTP, verifyOTP } = require("./otpController.js"); // Assuming this file exists

const app = express();
const PORT = 3007;

app.use(cors());
app.use(bodyParser.json());

// Initialize PostgreSQL connection pool
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

pool.connect()
  .then(() => console.log("✅ Connected to Supabase PostgreSQL"))
  .catch((err) => console.error("❌ Database error:", err));

/** REGISTER */
app.post("/register", async (req, res) => {
  const { firstName, lastName, phoneNumber, emailAdd, password } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    await pool.query(
      `INSERT INTO users (first_name, last_name, phone_number, email, password)
       VALUES ($1, $2, $3, $4, $5)`,
      [firstName, lastName, phoneNumber, emailAdd, hashedPassword]
    );

    res.status(200).send("Registered successfully");
  } catch (err) {
    console.error("Error inserting:", err);
    res.status(500).send("Error registering user");
  }
});

/** LOGIN */
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

    res.status(200).json({
      message: "Login successful",
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

/** BOOKING (CREATE) */
app.post("/booking", async (req, res) => {
  const { userId, service, date, address, notes, forAssessment } = req.body;

  try {
    await pool.query(
      `INSERT INTO bookings (user_id, service, booking_date, address, notes, for_assessment)
       VALUES ($1, $2, $3, $4, $5, $6)`,
      [userId, service, date, address, notes, forAssessment]
    );

    res.status(200).send("Booking successful");
  } catch (err) {
    console.error("Error inserting booking:", err);
    res.status(500).send("Error booking service");
  }
});

/** BOOKING (READ - GET ALL) */
app.get("/bookings", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM bookings ORDER BY booking_date DESC");
    res.json(result.rows);
  } catch (err) {
    console.error("Error fetching bookings:", err);
    res.status(500).send("Error fetching bookings");
  }
});

/** BOOKING (UPDATE) */
app.put("/bookings/:id", async (req, res) => {
  const { id } = req.params;
  const { service, booking_date, address, notes } = req.body;

  try {
    const result = await pool.query(
      `UPDATE bookings 
       SET service=$1, booking_date=$2, address=$3, notes=$4
       WHERE id=$5
       RETURNING *`,
      [service, booking_date, address, notes, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).send("Booking not found");
    }

    res.status(200).json(result.rows[0]);
  } catch (err) {
    console.error("Error updating booking:", err);
    res.status(500).send(`Error updating booking: ${err.message}`);
  }
});


/** CUSTOMER ANALYTICS (READ - GET ALL) */
app.get("/analytics", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM customer_analytics ORDER BY last_booking DESC");
    res.json(result.rows);
  } catch (err) {
    console.error("Error fetching analytics:", err);
    res.status(500).send("Error fetching customer analytics");
  }
});

/** SALES AND REQUEST (READ - GET ALL) */
app.get("/sales", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM sales_request ORDER BY created_at DESC");
    res.json(result.rows);
  } catch (err) {
    console.error("Error fetching sales:", err);
    res.status(500).send("Error fetching sales");
  }
});

app.post("/send-otp", sendOTP);
app.post("/verify-otp", verifyOTP);

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});

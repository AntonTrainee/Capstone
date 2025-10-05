// server.js
require("dotenv").config();
const express = require("express");
const path = require("path");
const { Pool } = require("pg");
const cors = require("cors");
const bodyParser = require("body-parser");
const bcrypt = require("bcrypt");
const { sendOTP, verifyOTP } = require("./otpController.js");
const multer = require("multer");
const fs = require("fs");


const app = express();
const PORT = 3007;

const requireAuth = require("./authMiddleware");

if (!fs.existsSync("uploads")) {
  fs.mkdirSync("uploads");
}

app.get("/api/customer-dashboard", requireAuth, (req, res) => {
  res.json({ message: "Welcome to your dashboard, " + req.user.email });
});



app.use(cors());
app.use(bodyParser.json());

// Initialize PostgreSQL connection pool
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

// ======================= PASSWORD RESET =======================
app.post("/forgot-password", async (req, res) => {
  const { email } = req.body;

  try {
    // Check if user exists
    const result = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
    if (result.rows.length === 0) {
      return res.status(400).json({ success: false, message: "No account found with that email" });
    }

    const user = result.rows[0];

    // Generate reset token (JWT)
    const resetToken = jwt.sign({ id: user.id, email: user.email }, SECRET, { expiresIn: "15m" });

    // Create reset link (point this to your frontend Reset Password page)
    const resetLink = `http://localhost:5173/resetpassword?token=${resetToken}`;

    // Setup transporter
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL,
        pass: process.env.EMAIL_PASS,
      },
    });

    // Email options
    const mailOptions = {
      from: process.env.EMAIL,
      to: email,
      subject: "Password Reset Request",
      html: `
        <p>You requested a password reset for your GenClean account.</p>
        <p>Click the link below to reset your password (valid for 15 minutes):</p>
        <a href="${resetLink}">${resetLink}</a>
      `,
    };

    await transporter.sendMail(mailOptions);

    res.status(200).json({ success: true, message: "Password reset email sent!" });
  } catch (err) {
    console.error("❌ Forgot password error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// Reset Password endpoint (after clicking link)
app.post("/reset-password", async (req, res) => {
  const { token, newPassword } = req.body;

  try {
    // Verify token
    const decoded = jwt.verify(token, SECRET);

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update in DB
    await pool.query("UPDATE users SET password = $1 WHERE id = $2", [
      hashedPassword,
      decoded.id,
    ]);

    res.status(200).json({ success: true, message: "Password reset successful!" });
  } catch (err) {
    console.error("❌ Reset password error:", err);
    res.status(500).json({ success: false, message: "Invalid or expired token" });
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


// ======================= MULTER CONFIG =======================
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});
const upload = multer({ storage });

// ✅ Make uploads publicly accessible
app.use("/uploads", express.static("uploads"));

// Middleware
app.use(cors());
app.use(bodyParser.json());


// ======================= Before and After =======================
// Get all before/after posts
app.get("/beforeafter", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM before_after ORDER BY created_at DESC");
    res.json(result.rows);
  } catch (err) {
    console.error("Error fetching before/after posts:", err);
    res.status(500).json({ error: "Failed to fetch posts" });
  }
});

// ======================= Before and After Add (WITH MULTER) =======================
app.post(
  "/beforeafter",
  upload.fields([{ name: "before" }, { name: "after" }]),
  async (req, res) => {
    try {
      const { title } = req.body;

      if (!req.files["before"] || !req.files["after"]) {
        return res.status(400).json({ error: "Both before and after images are required" });
      }

      const beforeFile = req.files["before"][0].filename;
      const afterFile = req.files["after"][0].filename;

      const beforeUrl = `http://localhost:${PORT}/uploads/${beforeFile}`;
      const afterUrl = `http://localhost:${PORT}/uploads/${afterFile}`;

      const result = await pool.query(
        "INSERT INTO before_after (title, before_url, after_url) VALUES ($1, $2, $3) RETURNING *",
        [title, beforeUrl, afterUrl]
      );

      res.status(201).json(result.rows[0]);
    } catch (err) {
      console.error("Error inserting post:", err);
      res.status(500).json({ error: "Failed to insert post" });
    }
  }
);

// ======================= DELETE PICS =======================
app.delete("/beforeafter/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query(
      "DELETE FROM before_after WHERE id = $1 RETURNING *",
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Post not found" });
    }

    res.json({ success: true, message: "Post deleted successfully" });
  } catch (err) {
    console.error("Error deleting post:", err);
    res.status(500).json({ error: "Failed to delete post" });
  }
});


// ======================= UPDATE PROFILE =======================
app.put("/update-profile", requireAuth, async (req, res) => {
  const { firstName, lastName, password } = req.body;
  const userId = req.user.id; // from requireAuth

  try {
    let query, params;

    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      query = `
        UPDATE users 
        SET first_name=$1, last_name=$2, password=$3 
        WHERE id=$4 
        RETURNING id, first_name, last_name, email, phone_number
      `;
      params = [firstName, lastName, hashedPassword, userId];
    } else {
      query = `
        UPDATE users 
        SET first_name=$1, last_name=$2 
        WHERE id=$3 
        RETURNING id, first_name, last_name, email, phone_number
      `;
      params = [firstName, lastName, userId];
    }

    const result = await pool.query(query, params);

    // Convert snake_case to camelCase for frontend
    const updatedUser = {
      id: result.rows[0].id,
      firstName: result.rows[0].first_name,
      lastName: result.rows[0].last_name,
      email: result.rows[0].email,
      phoneNumber: result.rows[0].phone_number,
    };

    res.status(200).json({ success: true, user: updatedUser });
  } catch (err) {
    console.error("❌ Update profile error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});


// ======================= BOOKING =======================
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

// ======================= CONTACT FORM =======================
const nodemailer = require("nodemailer");

app.post("/contact", async (req, res) => {
  const { name, email, phone, message } = req.body;

  try {
    // Setup transporter for Gmail
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL,
        pass: process.env.EMAIL_PASS, // app password from Google
      },
    });

    // Email options
    const mailOptions = {
      from: email, // customer’s email
      to: process.env.EMAIL, // your Gmail (GenClean inbox)
      subject: `New Contact Form Submission from ${name}`,
      text: `
        Name: ${name}
        Email: ${email}
        Phone: ${phone}
        Message: ${message}
      `,
    };

    // Send email
    await transporter.sendMail(mailOptions);

    res.status(200).json({ success: true, message: "Message sent successfully!" });
  } catch (err) {
    console.error("❌ Email send error:", err);
    res.status(500).json({ success: false, message: "Failed to send message." });
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


// ======================= FRONTEND SERVE =======================
app.use(express.static(path.join(__dirname, "../dist")));

app.get(/.*/, (req, res) => {
  res.sendFile(path.join(__dirname, "../dist/index.html"));
});


// ======================= SERVER START =======================
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});

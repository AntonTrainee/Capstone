require("dotenv").config();
const express = require("express");
const path = require("path");
const cors = require("cors");
const bodyParser = require("body-parser");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const multer = require("multer");
const fs = require("fs");
const { Pool } = require("pg");

// OTP Controller
const { sendOTP, verifyOTP } = require("./otpController.js");

const app = express();
const PORT = process.env.PORT || 3007;

// ================== Middleware ==================
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Ensure uploads directory exists
if (!fs.existsSync("uploads")) fs.mkdirSync("uploads");

// ================== PostgreSQL Connection ==================
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

pool.connect()
  .then(() => console.log("✅ Connected to PostgreSQL"))
  .catch((err) => console.error("❌ Database error:", err.message));

// ================== Auth Middleware ==================
function requireAuth(req, res, next) {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ message: "Not authenticated" });

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET || "yoursecret");
    req.user = payload;
    next();
  } catch {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
}

// ================== OTP Routes ==================
app.post("/send-otp", sendOTP);
app.post("/verify-otp", verifyOTP);

// ================== REGISTER ==================
app.post("/register", async (req, res) => {
  const { firstName, lastName, phoneNumber, email, password } = req.body;

  if (!firstName || !lastName || !email || !password) {
    return res.status(400).json({ success: false, message: "Missing required fields" });
  }

  try {
    const existing = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
    if (existing.rows.length > 0) {
      return res.status(400).json({ success: false, message: "Email already registered" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await pool.query(
      `INSERT INTO users (first_name, last_name, phone_number, email, password)
       VALUES ($1, $2, $3, $4, $5)`,
      [firstName, lastName, phoneNumber, email, hashedPassword]
    );

    res.status(200).json({ success: true, message: "Registered successfully" });
  } catch (err) {
    console.error("❌ Error inserting user:", err);
    res.status(500).json({ success: false, message: "Error registering user" });
  }
});

// ================== LOGIN ==================
app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const result = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
    if (result.rows.length === 0) {
      return res.status(400).json({ message: "User not found" });
    }

    const user = result.rows[0];
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid password" });

    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET || "yoursecret",
      { expiresIn: "1h" }
    );

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
    console.error("❌ Login error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// ================== PASSWORD RESET ==================
app.post("/forgot-password", async (req, res) => {
  const { email } = req.body;

  try {
    const result = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
    if (result.rows.length === 0) {
      return res.status(400).json({ success: false, message: "No account found with that email" });
    }

    const user = result.rows[0];
    const resetToken = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET || "yoursecret", { expiresIn: "15m" });
    const resetLink = `http://localhost:${PORT}/resetpassword?token=${resetToken}`;

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: { user: process.env.EMAIL, pass: process.env.EMAIL_PASS },
    });

    await transporter.sendMail({
      from: process.env.EMAIL,
      to: email,
      subject: "Password Reset Request",
      html: `<p>You requested a password reset.</p><a href="${resetLink}">Reset Password</a>`,
    });

    res.status(200).json({ success: true, message: "Password reset email sent!" });
  } catch (err) {
    console.error("❌ Forgot password error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

app.post("/reset-password", async (req, res) => {
  const { token, newPassword } = req.body;

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "yoursecret");
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await pool.query("UPDATE users SET password = $1 WHERE id = $2", [hashedPassword, decoded.id]);

    res.status(200).json({ success: true, message: "Password reset successful!" });
  } catch (err) {
    console.error("❌ Reset password error:", err);
    res.status(500).json({ success: false, message: "Invalid or expired token" });
  }
});

// ================== CONTACT FORM ==================
app.post("/contact", async (req, res) => {
  const { name, email, phone, message } = req.body;

  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: { user: process.env.EMAIL, pass: process.env.EMAIL_PASS },
    });

    await transporter.sendMail({
      from: email,
      to: process.env.EMAIL,
      subject: `New Contact Form Submission from ${name}`,
      text: `Name: ${name}\nEmail: ${email}\nPhone: ${phone}\nMessage: ${message}`,
    });

    res.status(200).json({ success: true, message: "Message sent successfully!" });
  } catch (err) {
    console.error("❌ Contact email error:", err);
    res.status(500).json({ success: false, message: "Failed to send message." });
  }
});

// ================== BEFORE & AFTER UPLOADS ==================
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname)),
});
const upload = multer({ storage });
app.use("/uploads", express.static("uploads"));

app.post("/beforeafter", upload.fields([{ name: "before" }, { name: "after" }]), async (req, res) => {
  try {
    const { title } = req.body;
    if (!req.files["before"] || !req.files["after"]) {
      return res.status(400).json({ error: "Both before and after images are required" });
    }

    const beforeUrl = `http://localhost:${PORT}/uploads/${req.files["before"][0].filename}`;
    const afterUrl = `http://localhost:${PORT}/uploads/${req.files["after"][0].filename}`;

    const result = await pool.query(
      "INSERT INTO before_after (title, before_url, after_url) VALUES ($1, $2, $3) RETURNING *",
      [title, beforeUrl, afterUrl]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error("❌ Error inserting post:", err);
    res.status(500).json({ error: "Failed to insert post" });
  }
});

// ================== Serve Frontend ==================
app.use(express.static(path.join(__dirname, "../dist")));
app.get(/.*/, (req, res) => res.sendFile(path.join(__dirname, "../dist/index.html")));

// ================== Start Server ==================
app.listen(PORT, () => {
  console.log("Loaded email:", process.env.EMAIL);
  console.log("Loaded email pass:", process.env.EMAIL_PASS ? "✅ exists" : "❌ missing");
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});

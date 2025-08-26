require("dotenv").config();
const nodemailer = require("nodemailer");
const { Pool } = require("pg");

const otpStore = {};

// PostgreSQL pool
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

async function sendOTP(req, res) {
  const userEmailInput = req.body.email;

  if (!userEmailInput) {
    return res.status(400).json({ message: "Email is required" });
  }

  const otp = Math.floor(100000 + Math.random() * 900000);
  otpStore[userEmailInput] = otp;

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL,
      pass: process.env.EMAIL_PASS,
    },
  });

  try {
    await transporter.sendMail({
      from: process.env.EMAIL,
      to: userEmailInput,
      subject: "Your OTP Code",
      text: `Your OTP code is: ${otp}`,
    });

    res.status(200).json({ message: "OTP sent successfully" });
  } catch (err) {
    console.error("Error sending email:", err);
    res.status(500).json({ message: "Failed to send OTP", error: err.message });
  }
}

async function verifyOTP(req, res) {
  const { email, otp } = req.body;

  if (otpStore[email] && otpStore[email] == otp) {
    delete otpStore[email];

    try {
      const result = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
      if (result.rows.length === 0) {
        return res.status(404).json({ message: "User not found" });
      }

      const user = result.rows[0];

      // ✅ Return full user object
      res.status(200).json({
        message: "OTP verified",
        user: {
          id: user.id,
          firstName: user.first_name,
          lastName: user.last_name,
          email: user.email,
          phoneNumber: user.phone_number,
        },
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Server error" });
    }
  } else {
    res.status(400).json({ message: "Invalid OTP" });
  }
}

module.exports = { sendOTP, verifyOTP };

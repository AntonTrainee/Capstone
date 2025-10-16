require("dotenv").config();
const nodemailer = require("nodemailer");

// Temporary store for OTPs (in-memory)
const otpStore = {};

// ================== SEND OTP ==================
async function sendOTP(req, res) {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ success: false, message: "Email is required" });
  }

  // Generate 6-digit OTP
  const otp = Math.floor(100000 + Math.random() * 900000);
  otpStore[email.trim().toLowerCase()] = otp; // normalize email

  // Nodemailer transporter
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
      to: email,
      subject: "Your OTP Code",
      text: `Your OTP code is: ${otp}`,
    });

    console.log(`📩 OTP sent to ${email}: ${otp}`);
    res.status(200).json({ success: true, message: "OTP sent successfully" });
  } catch (err) {
    console.error("❌ Error sending OTP:", err);
    res.status(500).json({ success: false, message: "Failed to send OTP" });
  }
}

// ================== VERIFY OTP ==================
function verifyOTP(req, res) {
  const { email, otp } = req.body;

  if (!email || !otp) {
    return res.status(400).json({ success: false, message: "Email and OTP are required" });
  }

  const normalizedEmail = email.trim().toLowerCase();
  const cleanOtp = otp.toString().trim();

  // Check if OTP exists and matches
  if (!otpStore[normalizedEmail] || otpStore[normalizedEmail].toString() !== cleanOtp) {
    console.log(`❌ Invalid OTP attempt for ${email}: entered ${otp}, expected ${otpStore[normalizedEmail]}`);
    return res.status(400).json({ success: false, message: "Invalid OTP" });
  }

  // OTP is correct, remove it
  delete otpStore[normalizedEmail];

  console.log(`✅ OTP verified for ${email}`);
  res.status(200).json({ success: true, message: "OTP verified successfully!" });
}

module.exports = { sendOTP, verifyOTP };


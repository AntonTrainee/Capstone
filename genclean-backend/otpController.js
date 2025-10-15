// otpController.js
require("dotenv").config();
const { Resend } = require("resend");

// ================== RESEND SETUP ==================
const resend = new Resend(process.env.RESEND_API_KEY);

// Temporary store for OTPs (in-memory)
const otpStore = {};

// ================== SEND OTP ==================
async function sendOTP(req, res) {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ success: false, message: "Email is required" });
  }

  try {
    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000);
    otpStore[email.trim().toLowerCase()] = otp; // store normalized email

    // Send email using Resend
    await resend.emails.send({
      from: "GenClean <noreply@genclean.com>",
      to: email,
      subject: "Your OTP Code",
      html: `
        <div style="font-family: Arial, sans-serif; line-height: 1.5;">
          <h2>GenClean Verification</h2>
          <p>Your OTP code is:</p>
          <h1 style="color: #007BFF;">${otp}</h1>
          <p>This code will expire soon. Please do not share it with anyone.</p>
        </div>
      `,
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

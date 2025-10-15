require("dotenv").config();
const { Resend } = require("resend");

const resend = new Resend(process.env.RESEND_API_KEY);
const otpStore = {};

async function sendOTP(req, res) {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ success: false, message: "Email is required" });
  }

  const otp = Math.floor(100000 + Math.random() * 900000);
  otpStore[email.trim().toLowerCase()] = otp;

  try {
    const data = await resend.emails.send({
      from: "GenClean <onboarding@resend.dev>",
      to: email,
      subject: "Your OTP Code",
      html: `<p>Your OTP code is: <b>${otp}</b></p><p>This code will expire in 5 minutes.</p>`,
    });

    console.log(`📩 OTP sent to ${email}: ${otp}`);
    res.status(200).json({ success: true, message: "OTP sent successfully" });
  } catch (err) {
    console.error("❌ Error sending OTP:", err);
    res.status(500).json({ success: false, message: "Failed to send OTP" });
  }
}

function verifyOTP(req, res) {
  const { email, otp } = req.body;

  if (!email || !otp) {
    return res.status(400).json({ success: false, message: "Email and OTP are required" });
  }

  const normalizedEmail = email.trim().toLowerCase();
  const cleanOtp = otp.toString().trim();

  if (!otpStore[normalizedEmail] || otpStore[normalizedEmail].toString() !== cleanOtp) {
    console.log(`❌ Invalid OTP attempt for ${email}`);
    return res.status(400).json({ success: false, message: "Invalid OTP" });
  }

  delete otpStore[normalizedEmail];
  console.log(`✅ OTP verified for ${email}`);
  res.status(200).json({ success: true, message: "OTP verified successfully!" });
}

module.exports = { sendOTP, verifyOTP };

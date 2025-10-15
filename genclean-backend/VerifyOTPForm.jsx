import { useState } from "react";
import axios from "axios";

function VerifyOTPForm({ email, onVerified }) {
  const [otp, setOtp] = useState("");
  const [status, setStatus] = useState("");
  const [sent, setSent] = useState(false);

  const resendOTP = async () => {
    if (sent) return;

    try {
      const response = await axios.post("http://localhost:3007/send-otp", { email });
      setStatus(response.data.message || "OTP sent successfully.");
      setSent(true);

      // allow resend again after 30 seconds
      setTimeout(() => setSent(false), 30000);
    } catch (err) {
      console.error(err);
      setStatus("Failed to resend OTP.");
    }
  };

  const handleVerify = async () => {
    if (!otp) {
      setStatus("Please enter the OTP code.");
      return;
    }

    try {
      const response = await axios.post("http://localhost:3007/verify-otp", { email, otp });

      if (response.data.success) {
        setStatus("✅ OTP verified successfully!");
        if (onVerified) onVerified();
      } else {
        setStatus(response.data.message || "❌ Invalid OTP.");
      }
    } catch (err) {
      console.error(err);
      setStatus("Something went wrong during verification.");
    }
  };

  return (
    <div style={{ textAlign: "center", padding: "20px" }}>
      <h2>Verify OTP</h2>
      <p>Email: {email}</p>

      <div style={{ marginBottom: "10px" }}>
        <button onClick={resendOTP} disabled={sent}>
          {sent ? "OTP Sent" : "Resend OTP"}
        </button>
      </div>

      <input
        type="text"
        placeholder="Enter OTP code"
        value={otp}
        onChange={(e) => setOtp(e.target.value)}
        style={{ padding: "8px", marginBottom: "10px", width: "200px" }}
      />
      <br />
      <button onClick={handleVerify}>Verify</button>
      <p>{status}</p>
    </div>
  );
}

export default VerifyOTPForm;

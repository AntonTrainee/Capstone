import { useState } from "react";
import axios from "axios";

function VerifyOTPForm({ email }) {
  const [otp, setOtp] = useState("");
  const [status, setStatus] = useState("");

  const handleVerify = async () => {
    try {
      const response = await axios.post("http://localhost:3007/verify-otp", {
        email,
        otp,
      });

      if (response.data.message === "OTP verified") {
        setStatus("✅ Verified!");
      } else {
        setStatus("❌ Invalid code.");
      }
    } catch (err) {
      console.error("Error verifying OTP:", err);
      setStatus("Something went wrong.");
    }
  };

  return (
    <div>
      <h2>Verify OTP</h2>
      <input
        type="text"
        placeholder="Enter OTP code"
        value={otp}
        onChange={(e) => setOtp(e.target.value)}
      />
      <button onClick={handleVerify}>Verify</button>
      <p>{status}</p>
    </div>
  );
}

export default VerifyOTPForm;
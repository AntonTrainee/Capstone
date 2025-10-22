import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Genclean from "../assets/Gemini_Generated_Image_bmrzg0bmrzg0bmrz-removebg-preview.png";

function OtpPage() {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [message, setMessage] = useState("");

  const location = useLocation();
  const navigate = useNavigate();

  // Grab email from navigation state
  useEffect(() => {
    if (location.state?.email) {
      setEmail(location.state.email.trim().toLowerCase());
    }
  }, [location]);

  // ================== Resend OTP ==================
  const handleSendOtp = async () => {
    if (!email) {
      setMessage("Please enter an email first.");
      return;
    }

    try {
      const res = await fetch("https://capstone-ni5z.onrender.com/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();
      setMessage(data.message || "OTP resent successfully");
    } catch (error) {
      console.error(error);
      setMessage("Failed to resend OTP.");
    }
  };

  // ================== Verify OTP ==================
  const handleVerifyOtp = async () => {
    if (!otp) {
      setMessage("Please enter the OTP.");
      return;
    }

    try {
      const verifyRes = await fetch("https://capstone-ni5z.onrender.com/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp: otp.toString().trim() }),
      });

      const verifyData = await verifyRes.json();

      if (!verifyData.success) {
        setMessage(verifyData.message || "Invalid or expired OTP");
        return;
      }

      setMessage("✅ OTP verified successfully! Finalizing registration...");

      // Step 2: Retrieve pending user data
      const pendingUser = localStorage.getItem("pendingUser");
      if (!pendingUser) {
        setMessage("No user data found. Please register again.");
        return;
      }

      const userData = JSON.parse(pendingUser);

      // Step 3: Send to /register for final DB insert
      const registerRes = await fetch("https://capstone-ni5z.onrender.com/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userData),
      });

      const registerData = await registerRes.json();

      if (registerData.success) {
        setMessage("🎉 Registration complete! Redirecting...");
        localStorage.removeItem("pendingUser");

        // Store user info for dashboard session
        localStorage.setItem("user", JSON.stringify(registerData.user));

        setTimeout(() => {
          navigate("/Login");
        }, 1200);
      } else {
        setMessage(registerData.message || "Registration failed after OTP verification.");
      }
    } catch (error) {
      console.error("Error verifying OTP:", error);
      setMessage("Something went wrong during OTP verification.");
    }
  };

  // ================== UI ==================
  return (
    <div className="colorscheme">
      <div className="blue-box">
        <h1 className="navbar-brand" style={{ textAlign: "center" }}>
          <img src={Genclean} alt="GenClean Logo" className="genclean-logo" />
        </h1>
      </div>

      <div className="white-box d-flex flex-column align-items-center justify-content-center">
        <h1 className="createAcc mb-4">OTP Verification</h1>

        <div className="form-floating mb-3 w-75">
          <input
            type="text"
            className="form-control"
            placeholder="OTP Code"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
          />
          <label>OTP Code</label>
        </div>

        <button className="btn crAct-btn mb-3 w-75" onClick={handleVerifyOtp}>
          Verify OTP
        </button>

        <button className="btn crAct-btn mb-3 w-75" onClick={handleSendOtp}>
          Resend OTP
        </button>

        <p>{message}</p>
      </div>
    </div>
  );
}

export default OtpPage;

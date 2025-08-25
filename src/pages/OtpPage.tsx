import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

function OtpPage() {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [message, setMessage] = useState("");

  const location = useLocation();
  const navigate = useNavigate();

  // Auto-send OTP when arriving from Register page
  useEffect(() => {
    if (location.state?.email) {
      setEmail(location.state.email);
      handleSendOtp(location.state.email); // automatically trigger OTP
    }
  }, [location]);

  const handleSendOtp = async (passedEmail?: string) => {
    const targetEmail = passedEmail || email;

    if (!targetEmail) {
      setMessage("Please enter an email first.");
      return;
    }

    try {
      const res = await fetch("http://localhost:3007/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: targetEmail }),
      });

      const data = await res.json();
      setMessage(data.message);
    } catch (error) {
      setMessage("Failed to send OTP.");
      console.error(error);
    }
  };

  const handleVerifyOtp = async () => {
    if (!otp) {
      setMessage("Please enter the OTP.");
      return;
    }

    try {
      const res = await fetch("http://localhost:3007/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp }),
      });

      const data = await res.json();
      setMessage(data.message);

      if (data.message === "OTP verified") {

         setTimeout(() => {
          navigate("/customerdashb");
        }, 1000);
      }
    } catch (error) {
      setMessage("Error verifying OTP.");
      console.error(error);
    }
  };

  return (
    <div className="colorscheme">
      <div className="blue-box">
        <h1 className="logo" style={{ textAlign: "center" }}>
          GenClean
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
        <button
          className="btn crAct-btn mb-3 w-75"
          onClick={() => handleSendOtp()}
        >
          Resend OTP
        </button>

        <p>{message}</p>
      </div>
    </div>
  );
}

export default OtpPage;

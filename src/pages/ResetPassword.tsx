import { useState } from "react";
import Genclean from "../assets/Gemini_Generated_Image_bmrzg0bmrzg0bmrz-removebg-preview.png";
import { useNavigate } from "react-router-dom";

function ResetPassword() {
  const [newPassword, setNewPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const params = new URLSearchParams(window.location.search);
  const token = params.get("token");

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");

    if (!token) {
      setMessage("Invalid or missing token.");
      return;
    }

    if (newPassword.length < 8) {
      setMessage("❌ Password must be at least 8 characters long.");
      return;
    }

    try {
      const res = await fetch(
        "https://capstone-ni5z.onrender.com/reset-password",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token, newPassword }),
        }
      );

      const data = await res.json();
      if (res.ok) {
        setMessage("✅ Password reset successful! Redirecting...");
        setTimeout(() => navigate("/login"), 2000);
      } else {
        setMessage(data.message || "❌ Reset failed. Try again.");
      }
    } catch (error) {
      console.error(error);
      setMessage("Unexpected error. Try again.");
    }
  };

  return (
    <div className="colorscheme">
      <div className="blue-box">
        <h1 className="navbar-brand" style={{ textAlign: "center" }}>
          <img src={Genclean} alt="GenClean Logo" className="genclean-logo" />
        </h1>
      </div>

      <div className="white-box d-flex flex-column align-items-center justify-content-center">
        <h1 className="createAcc mb-4">Reset Password</h1>

        <form className="w-75" onSubmit={handleReset}>
          <div className="form-floating mb-3 position-relative">
            <input
              type={showPassword ? "text" : "password"}
              className="form-control"
              placeholder="New Password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />
            <label>New Password</label>

            <span
              onClick={() => setShowPassword(!showPassword)}
              style={{
                position: "absolute",
                right: "15px",
                top: "50%",
                transform: "translateY(-50%)",
                cursor: "pointer",
                fontSize: "1.2rem",
              }}
            >
              <i className={showPassword ? "bi bi-eye-fill" : "bi bi-eye"}></i>
            </span>

            {newPassword && newPassword.length < 8 && (
              <p
                style={{
                  color: "red",
                  fontSize: "0.85rem",
                  marginTop: "0.25rem",
                }}
              >
                Password must be at least 8 characters long
              </p>
            )}
          </div>

          <button type="submit" className="btn crAct-btn mx-auto d-block">
            Reset Password
          </button>
        </form>

        {message && <p className="mt-3">{message}</p>}
      </div>
    </div>
  );
}

export default ResetPassword;

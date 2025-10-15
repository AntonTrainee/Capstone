import { useState } from "react";
import Genclean from "../assets/Gemini_Generated_Image_bmrzg0bmrzg0bmrz-removebg-preview.png";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("Sending reset request...");

    try {
      const res = await fetch("https://capstone-ni5z.onrender.com/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      if (res.ok) {
        setStatus("If that email is registered, you’ll get a reset link.");
        setEmail("");
      } else {
        setStatus("Failed to send reset request. Try again.");
      }
    } catch (err) {
      console.error(err);
      setStatus("An error occurred. Please try again.");
    }
  };

  return (
    <div className="colorscheme">
      <div className="blue-box">
        <h1 className="navbar-brand" style={{ textAlign: "center" }}>
          <img
            src={Genclean}
            alt="GenClean Logo"
            className="genclean-logo"
          />
        </h1>
      </div>

      <div className="white-box d-flex flex-column align-items-center justify-content-center">
        <h1 className="createAcc mb-4">Forgot Password</h1>

        <form className="w-75" onSubmit={handleSubmit}>
          <div className="form-floating mb-3">
            <input
              type="email"
              className="form-control"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <label>Email Address</label>
          </div>

          <button type="submit" className="btn crAct-btn mx-auto d-block">
            Reset Password
          </button>
        </form>

        {status && <p className="mt-3">{status}</p>}
      </div>
    </div>
  );
}

export default ForgotPassword;

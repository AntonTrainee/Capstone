import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import Genclean from "../assets/Gemini_Generated_Image_bmrzg0bmrzg0bmrz-removebg-preview.png";

const Register = () => {
  const [step, setStep] = useState(1);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [emailAdd, setEmailAdd] = useState("");
  const [password, setPassword] = useState("");
  const [conpassword, setConpassword] = useState("");
  const navigate = useNavigate();

  // ================== HANDLE SUBMIT ==================
  const handleSubmit = async () => {

    if (password.length < 8) {
      alert("Password must be at least 8 characters long");
      return;
    }

    if (password !== conpassword) {
      alert("Passwords do not match");
      return;
    }

    const userData = {
      firstName,
      lastName,
      phoneNumber,
      email: emailAdd,
      password,
    };

    try {
      // 1️⃣ Save user data temporarily in localStorage
      localStorage.setItem("pendingUser", JSON.stringify(userData));

      // 2️⃣ Send OTP to email
      const response = await fetch("https://capstone-ni5z.onrender.com/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: emailAdd }),
      });

      const data = await response.json();

      if (data.success) {
        alert("OTP sent! Check your email.");
        navigate("/otp", { state: { email: emailAdd } });
      } else {
        alert(data.message || "Failed to send OTP");
      }
    } catch (err) {
      console.error("Error sending OTP:", err);
      alert("Something went wrong while sending OTP");
    }
  };

  // ================== PHONE NUMBER FORMAT ==================
  const handlePhoneInput = (value: string) => {
    let digits = value.replace(/\D/g, "");
    if (!digits.startsWith("09")) digits = "09" + digits.slice(digits.startsWith("0") ? 1 : 0);
    if (digits.length > 11) digits = digits.slice(0, 11);

    let formatted = digits;
    if (digits.length > 4 && digits.length <= 7) {
      formatted = digits.slice(0, 4) + "-" + digits.slice(4);
    } else if (digits.length > 7) {
      formatted = digits.slice(0, 4) + "-" + digits.slice(4, 7) + "-" + digits.slice(7);
    }

    setPhoneNumber(formatted);
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
        <h1 className="createAcc mb-4">Create Account</h1>

        {step === 1 && (
          <>
            <div className="form-floating mb-3 w-75">
              <input
                type="text"
                className="form-control"
                placeholder="First Name"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
              />
              <label>First Name</label>
            </div>

            <div className="form-floating mb-3 w-75">
              <input
                type="text"
                className="form-control"
                placeholder="Last Name"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
              />
              <label>Last Name</label>
            </div>

            <div className="form-floating mb-4 w-75">
              <input
                type="tel"
                className="form-control"
                placeholder="Phone Number"
                value={phoneNumber}
                onChange={(e) => handlePhoneInput(e.target.value)}
              />
              <label>Phone Number</label>
            </div>

            <div className="mb-4">
              <p className="mb-0">
                <Link to="/Login" style={{ textDecoration: "none" }}>
                  Already have an account?{" "}
                </Link>
              </p>
            </div>

            <button
              className="btn crAct-btn"
              onClick={() => setStep(2)}
              disabled={!firstName || !lastName || !phoneNumber}
            >
              Next
            </button>
          </>
        )}

        {step === 2 && (
          <>
            <div className="form-floating mb-3 w-75">
              <input
                type="email"
                className="form-control"
                placeholder="Email Address"
                value={emailAdd}
                onChange={(e) => setEmailAdd(e.target.value)}
              />
              <label>Email Address</label>
            </div>

            <div className="form-floating mb-3 w-75">
              <input
                type="password"
                className="form-control"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <label>Password</label>
            </div>

            <div className="form-floating mb-4 w-75">
              <input
                type="password"
                className="form-control"
                placeholder="Confirm Password"
                value={conpassword}
                onChange={(e) => setConpassword(e.target.value)}
              />
              <label>Confirm Password</label>
            </div>

            <div className="d-flex gap-3">
              <button className="btn crAct-btn" onClick={() => setStep(1)}>
                Back
              </button>
              <button
                className="btn crAct-btn"
                onClick={handleSubmit}
                disabled={!emailAdd || !password || !conpassword}
              >
                Sign Up
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Register;
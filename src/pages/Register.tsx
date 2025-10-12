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

  // ✅ Validation functions
  const isValidEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const isValidPhoneNumber = (phone: string) => {
    const phRegex = /^09\d{2}-\d{3}-\d{4}$/; // Format: 09XX-XXX-XXXX
    return phRegex.test(phone);
  };

  const handleSubmit = () => {
    if (password !== conpassword) {
      alert("Passwords do not match");
      return;
    }

    if (!isValidEmail(emailAdd)) {
      alert("Please enter a valid email address");
      return;
    }

    if (!isValidPhoneNumber(phoneNumber)) {
      alert("Please enter a valid Philippine phone number (e.g., 0912-345-6789)");
      return;
    }

    const userData = {
      firstName,
      lastName,
      phoneNumber,
      emailAdd,
      password,
    };

    fetch("http://localhost:3007/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(userData),
    })
      .then((res) => res.text())
      .then((data) => {
        alert(data);
        localStorage.setItem("userData", JSON.stringify(userData));
        navigate("/otp", { state: { email: emailAdd } });
      })
      .catch((err) => {
        console.error(err);
        alert("Registration failed");
      });
  };

  // ✅ Auto-format PH number: 09XX-XXX-XXXX
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
                required
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
                required
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
                required
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
              onClick={() => {
                if (!firstName || !lastName || !phoneNumber) {
                  alert("Please fill out all fields.");
                  return;
                }
                if (!isValidPhoneNumber(phoneNumber)) {
                  alert("Please enter a valid Philippine phone number (09XX-XXX-XXXX).");
                  return;
                }
                setStep(2);
              }}
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
                required
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
                required
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
                required
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

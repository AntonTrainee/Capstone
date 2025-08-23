import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

const Register = () => {
  const [step, setStep] = useState(1);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [emailAdd, setEmailAdd] = useState("");
  const [password, setPassword] = useState("");
  const [conpassword, setConpassword] = useState("");

  const navigate = useNavigate();

  const handleSubmit = () => {
    if (password !== conpassword) {
      alert("Passwords do not match");
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
      headers: {
        "Content-Type": "application/json",
      },
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

  return (
    <div className="colorscheme">
      <div className="blue-box">
        <h1 className="logo" style={{ textAlign: "center" }}>
          GenClean
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
                onChange={(e) => setPhoneNumber(e.target.value)}
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

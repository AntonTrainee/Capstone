import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Genclean from "../assets/Gemini_Generated_Image_bmrzg0bmrzg0bmrz-removebg-preview.png";

interface LoginResponse {
  message?: string;
  token?: string;
  user?: {
    id: number;
    email: string;
    firstName?: string;
    lastName?: string;
    phoneNumber?: string;
    avatar_url?: string;
  };
}

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("customer"); // "customer" or "admin"
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const endpoint =
        role === "admin"
          ? "http://localhost:3007/admin-login"
          : "http://localhost:3007/login";

      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data: LoginResponse = await res.json();

      if (!res.ok) {
        setMessage(data.message || "Login failed.");
        return;
      }

      // Save token (for customer only)
      if (role === "customer") {
        localStorage.setItem("auth_token", data.token || "");
      }

      localStorage.setItem("user", JSON.stringify(data.user));

      // Redirect based on role
      if (role === "admin") {
        navigate("/admindashb");
      } else {
        navigate("/customerdashb");
      }
    } catch (err) {
      console.error(err);
      setMessage("Unexpected error. Please try again.");
    }
  };

  return (
    <div className="colorscheme">
      {/* Top Blue Section with Logo */}
      <div className="blue-box">
        <h1 className="navbar-brand" style={{ textAlign: "center" }}>
          <img
            src={Genclean}
            alt="GenClean Logo"
            className="genclean-logo"
          />
        </h1>
      </div>

      {/* White Login Box */}
      <div className="white-box d-flex flex-column align-items-center justify-content-center">
        <h1 className="createAcc mb-4">Login</h1>

        <form className="w-75" onSubmit={handleLogin}>
          {/* Email */}
          <div className="form-floating mb-3">
            <input
              type="email"
              className="form-control"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <label>Email Address</label>
          </div>

          {/* Password */}
          <div className="form-floating mb-1 position-relative">
            <input
              type={showPassword ? "text" : "password"}
              className="form-control"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <label>Password</label>
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
          </div>

          {/* Forgot Password */}
          <p
            style={{
              textAlign: "right",
              fontSize: "0.9rem",
              marginBottom: "20px",
            }}
          >
            <a
              href="/forgotpassword"
              style={{ textDecoration: "none", color: "#007bff" }}
            >
              Forgot Password?
            </a>
          </p>

          {/* Role Selection */}
          <div className="mb-3 text-center">
            <label className="me-3">
              <input
                type="radio"
                value="customer"
                checked={role === "customer"}
                onChange={() => setRole("customer")}
                className="me-1"
              />
              Customer
            </label>
            <label>
              <input
                type="radio"
                value="admin"
                checked={role === "admin"}
                onChange={() => setRole("admin")}
                className="me-1"
              />
              Admin
            </label>
          </div>

          {/* Login Button */}
          <button type="submit" className="btn crAct-btn mx-auto d-block">
            Login
          </button>
        </form>

        {message && <p className="mt-3 text-danger">{message}</p>}
      </div>
    </div>
  );
}

export default Login;

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Genclean from "../assets/Gemini_Generated_Image_bmrzg0bmrzg0bmrz-removebg-preview.png";

interface LoginResponse {
  message?: string;
  token?: string;
  role?: string;
  redirect?: string;
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
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const res = await fetch("https://capstone-ni5z.onrender.com/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data: LoginResponse = await res.json();

      if (!res.ok) {
        setMessage(data.message || "Login failed.");
        return;
      }

      // Save token and user info
      if (data.token && data.user) {
        localStorage.setItem("auth_token", data.token);
        localStorage.setItem("user", JSON.stringify({ ...data.user, role: data.role }));
      }

      // Redirect user based on role
      if (data.redirect) {
        navigate(data.redirect);
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
      <div className="blue-box">
        <h1 className="navbar-brand" style={{ textAlign: "center" }}>
          <img src={Genclean} alt="GenClean Logo" className="genclean-logo" />
        </h1>
      </div>

      <div className="white-box d-flex flex-column align-items-center justify-content-center">
        <h1 className="createAcc mb-4">Login</h1>

        <form className="w-75" onSubmit={handleLogin}>
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

          <p
            style={{
              textAlign: "right",
              fontSize: "0.9rem",
              marginBottom: "20px",
            }}
          >
            <a href="/forgotpassword" style={{ textDecoration: "none", color: "#007bff" }}>
              Forgot Password?
            </a>
          </p>

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

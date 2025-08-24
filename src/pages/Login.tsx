import { useState } from "react";
import { useNavigate } from "react-router-dom";

interface LoginResponse {
  message?: string;
  user?: {
    id: number;
    email: string;
    firstName: string;
    lastName: string;
    phoneNumber: string;
  };
}

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleCustomerLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("http://localhost:3007/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data: LoginResponse = await res.json();

      if (res.ok) {
        // 🔹 Save customer info
        if (data.user) {
          localStorage.setItem("user", JSON.stringify(data.user));
        }

        setTimeout(() => {
          navigate("/customerdashb");
        }, 1000);
      } else {
        setMessage(data.message || "Login failed. Please try again.");
      }
    } catch (error) {
      console.error(error);
      setMessage("Unexpected error. Please try again.");
    }
  };

  // Admin login
  const handleAdminLogin = async () => {
    try {
      const res = await fetch("http://localhost:3007/admin-login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data: LoginResponse = await res.json();

      if (res.ok) {
        // 🔹 Save admin info
        if (data.user) {
          localStorage.setItem("user", JSON.stringify(data.user));
        }

        setTimeout(() => {
          navigate("/admindashb");
        }, 1000);
      } else {
        setMessage(data.message || "Admin login failed. Please try again.");
      }
    } catch (error) {
      console.error(error);
      setMessage("Unexpected error. Please try again.");
    }
  };

  return (
    <div className="colorscheme">
      <div className="blue-box">
        <h1 className="logo" style={{ textAlign: "center" }}>
          Genclean
        </h1>
      </div>

      <div className="white-box d-flex flex-column align-items-center justify-content-center">
        <h1 className="createAcc mb-4">Login</h1>

        <form className="w-75" onSubmit={handleCustomerLogin}>
          <div className="form-floating mb-3">
            <input
              type="email"
              className="form-control"
              placeholder="Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <label>Email Address</label>
          </div>

          <div className="form-floating mb-3">
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

          <button type="submit" className="btn crAct-btn mx-auto d-block">
            Customer login
          </button>

          <button
            type="button"
            className="btn crAct-btn mx-auto d-block"
            onClick={handleAdminLogin}
          >
            Admin login
          </button>
        </form>

        {message && <p className="mt-3">{message}</p>}
      </div>
    </div>
  );
}

export default Login;

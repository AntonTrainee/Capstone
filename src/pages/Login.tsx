import { useState } from "react";
import { useNavigate } from "react-router-dom";

interface LoginResponse {
  message?: string;
  token?: string;
  user?: { id: number; email: string; firstName?: string; lastName?: string; phoneNumber?: string; avatar_url?: string; };
}

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
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
        localStorage.setItem("auth_token", data.token || "");
        localStorage.setItem("user", JSON.stringify(data.user));
        navigate("/customerdashb");
      } else setMessage(data.message || "Login failed.");
    } catch (err) {
      console.error(err);
      setMessage("Unexpected error. Please try again.");
    }
  };

  const handleAdminLogin = async () => {
    try {
      const res = await fetch("http://localhost:3007/admin-login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data: LoginResponse = await res.json();
      if (res.ok) {
        localStorage.setItem("user", JSON.stringify(data.user));
        navigate("/admindashb");
      } else setMessage(data.message || "Admin login failed.");
    } catch (err) {
      console.error(err);
      setMessage("Unexpected error. Please try again.");
    }
  };

  return (
  <>
   <div className="colorscheme">
      <div className="blue-box">
        <h1 className="logo" style={{ textAlign: "center" }}>Genclean</h1>
      </div>
      
      <div className="white-box d-flex flex-column align-items-center justify-content-center">
        <h1 className="createAcc mb-4">Login</h1>
        <form className="w-75" onSubmit={handleCustomerLogin}>
          <div className="form-floating mb-3">
            <input type="email" className="form-control" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} required/>
            <label>Email Address</label>
          </div>
          <div className="form-floating mb-1 position-relative">
            <input type={showPassword ? "text" : "password"} className="form-control" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} required/>
            <label>Password</label>
            <span onClick={() => setShowPassword(!showPassword)} style={{position:"absolute",right:"15px",top:"50%",transform:"translateY(-50%)",cursor:"pointer",fontSize:"1.2rem"}}>
              <i className={showPassword?"bi bi-eye-fill":"bi bi-eye"}></i>
            </span>
          </div>
          <p style={{ textAlign: "right", fontSize: "0.9rem", marginBottom:"20px" }}>
            <a href="/forgotpassword" style={{ textDecoration:"none", color:"#007bff" }}>Forgot Password?</a>
          </p>
          <button type="submit" className="btn crAct-btn mx-auto d-block mb-2">Customer login</button>
          <button type="button" className="btn crAct-btn mx-auto d-block" onClick={handleAdminLogin}>Admin login</button>
        </form>
        {message && <p className="mt-3">{message}</p>}
      </div>
    </div>
  </>
    
  );
}

export default Login;

import { useState, useEffect } from "react";
import Genclean from "../assets/Gemini_Generated_Image_bmrzg0bmrzg0bmrz-removebg-preview.png";

interface User {
  id: number;
  first_name?: string;
  last_name?: string;
  email: string;
  phone_number: string;
}

function Profile() {
  const [user, setUser] = useState<User | null>(null);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // ================== LOAD USER FROM LOCAL STORAGE ==================
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
      setFirstName(parsedUser.firstName || parsedUser.first_name || "");
      setLastName(parsedUser.lastName || parsedUser.last_name || "");
      setPhoneNumber(parsedUser.phoneNumber || parsedUser.phone_number || "");
    }
  }, []);

  // ================== PHONE NUMBER FORMAT ==================
  const handlePhoneInput = (value: string) => {
    let digits = value.replace(/\D/g, "");

    if (!digits.startsWith("09"))
      digits = "09" + digits.slice(digits.startsWith("0") ? 1 : 0);

    if (digits.length > 11) digits = digits.slice(0, 11);

    let formatted = digits;
    if (digits.length > 4 && digits.length <= 7) {
      formatted = digits.slice(0, 4) + "-" + digits.slice(4);
    } else if (digits.length > 7) {
      formatted =
        digits.slice(0, 4) + "-" + digits.slice(4, 7) + "-" + digits.slice(7);
    }

    setPhoneNumber(formatted);
  };

  // ================== HANDLE PROFILE UPDATE ==================
  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");

    const token = localStorage.getItem("auth_token");
    if (!token) return setMessage("User not authenticated");

    // 🔒 Check password length if user entered a new one
    if (password && password.length < 8) {
      setMessage("❌ Password must be at least 8 characters long.");
      return;
    }

    try {
      const res = await fetch(
        "https://capstone-ni5z.onrender.com/update-profile",
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            firstName,
            lastName,
            phoneNumber,
            password: password || undefined, // only send if filled
          }),
        }
      );

      const data = await res.json();
      if (res.ok && data.success) {
        setUser(data.user);
        localStorage.setItem("user", JSON.stringify(data.user));
        setPassword("");
        setMessage("✅ Profile updated successfully!");
      } else {
        setMessage(data.message || "❌ Failed to update profile.");
      }
    } catch (err) {
      console.error(err);
      setMessage("Unexpected error. Try again.");
    }
  };

  if (!user) return <p>Loading...</p>;

  return (
    <div className="colorscheme">
      <div className="blue-box">
        <h1 className="navbar-brand" style={{ textAlign: "center" }}>
          <img src={Genclean} alt="GenClean Logo" className="genclean-logo" />
        </h1>
      </div>

      <div className="white-box d-flex flex-column align-items-center justify-content-center">
        <h1 className="createAcc mb-4">Profile</h1>
        <form className="w-75" onSubmit={handleUpdateProfile}>
          <div className="form-floating mb-3">
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

          <div className="form-floating mb-3">
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

          <div className="form-floating mb-3">
            <input
              type="email"
              className="form-control"
              placeholder="Email"
              value={user.email}
              disabled
            />
            <label>Email Address</label>
          </div>

          <div className="form-floating mb-3">
            <input
              type="text"
              className="form-control"
              placeholder="Phone Number"
              value={phoneNumber}
              onChange={(e) => handlePhoneInput(e.target.value)}
              required
            />
            <label>Phone Number</label>
          </div>

          <div className="form-floating mb-1 position-relative">
            <input
              type={showPassword ? "text" : "password"}
              className="form-control"
              placeholder="New Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
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

            {/* ⚠️ Inline password warning (only shows if user types) */}
            {password && password.length < 8 && (
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

          <button type="submit" className="btn crAct-btn mx-auto d-block mt-3">
            Update Profile
          </button>
        </form>
        {message && <p className="mt-3">{message}</p>}
      </div>
    </div>
  );
}

export default Profile;

import { useState, useEffect } from "react";

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

  // Load user from localStorage
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

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem("auth_token");
    if (!token) return setMessage("User not authenticated");

    try {
      const res = await fetch("http://localhost:3007/update-profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({
          firstName,
          lastName,
          phoneNumber,
          password: password || undefined, // only send if filled
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setUser(data.user);
        localStorage.setItem("user", JSON.stringify(data.user));
        setPassword("");
        setMessage("Profile updated successfully!");
      } else {
        setMessage(data.message || "Failed to update profile.");
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
        <h1 className="logo" style={{ textAlign: "center" }}>Genclean</h1>
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
              onChange={e => setFirstName(e.target.value)}
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
              onChange={e => setLastName(e.target.value)}
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
                onChange={e => setPhoneNumber(e.target.value)}
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
              onChange={e => setPassword(e.target.value)}
            />
            <label>New Password</label>
            <span
              onClick={() => setShowPassword(!showPassword)}
              style={{ position: "absolute", right: "15px", top: "50%", transform: "translateY(-50%)", cursor: "pointer", fontSize: "1.2rem" }}
            >
              <i className={showPassword ? "bi bi-eye-fill" : "bi bi-eye"}></i>
            </span>
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

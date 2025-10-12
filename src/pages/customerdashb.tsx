import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

import genmain from "../assets/general-maintenance.jpg";
import janitor from "../assets/janitorial-services-1536x1024.jpg";
import pest from "../assets/pest-control-UT-hybridpestcontrol-scaled-2560x1280.jpeg";
import Footer from "../components/footer";

function CustomerDashb() {
  const [activeSection, setActiveSection] = useState<"bookings" | "history">("bookings");
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [user, setUser] = useState<{ firstName: string; lastName: string } | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("auth_token");
    if (!token) navigate("/");

    const storedUser = localStorage.getItem("user");
    if (storedUser) setUser(JSON.parse(storedUser));
  }, [navigate]);

  const handleLinkClick = (section: "bookings" | "history") => {
    setActiveSection(section);
    setIsDrawerOpen(false);
  };

  const handleBookLinkClick = () => {
    setIsDrawerOpen(false);
  };

  return (
    <>
      {/* NAVBAR — brand and new drawer toggle */}
      <nav className="navbar navbar-expand-lg my-navbar sticky-top">
        <div className="container-fluid">
          <a className="navbar-brand" href="#">
            GenClean
          </a>

          {/* DRAWER TOGGLE BUTTON */}
          <button
            className="navbar-toggler profile-toggler"
            type="button"
            aria-label="Toggle profile menu"
            onClick={() => setIsDrawerOpen(!isDrawerOpen)}
          >
            <span className="navbar-toggler-icon"></span>
          </button>
        </div>
      </nav>

      {/* DRAWER BACKDROP */}
      {isDrawerOpen && (
        <div className="drawer-backdrop" onClick={() => setIsDrawerOpen(false)}></div>
      )}

      {/* MAIN DASHBOARD CONTENT */}
      <div className="dashboard-content">
        <div className="left-column-content">
          <div className="booked-services-column">
            <div className="booked-services-card">
              {activeSection === "bookings" ? (
                <>
                  <h1 className="booked-services-title" id="Bookings">
                    Booked Services
                  </h1>
                  <div className="table-container">
                    <table className="bookings-table">
                      <thead>
                        <tr>
                          <th>Service ID</th>
                          <th>Service Type</th>
                          <th>Address</th>
                          <th>Date & Time</th>
                          <th>Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td>001</td>
                          <td>Cleaning</td>
                          <td>123 Main St</td>
                          <td>2025-08-20 10:00 AM</td>
                          <td>Completed</td>
                        </tr>
                        <tr>
                          <td>002</td>
                          <td>Maintenance</td>
                          <td>45 Elm Ave</td>
                          <td>2025-08-21 2:00 PM</td>
                          <td>Pending</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </>
              ) : (
                <>
                  <h1 className="booked-services-title" id="History">
                    History
                  </h1>
                  <div className="table-container">
                    <table className="bookings-table">
                      <thead>
                        <tr>
                          <th>Service ID</th>
                          <th>Service Type</th>
                          <th>Address</th>
                          <th>Date & Time</th>
                          <th>Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td>0001</td>
                          <td>Cleaning</td>
                          <td>12 Oak St</td>
                          <td>2025-07-15 9:00 AM</td>
                          <td>Completed</td>
                        </tr>
                        <tr>
                          <td>0002</td>
                          <td>Pest Control</td>
                          <td>77 Pine Rd</td>
                          <td>2025-07-20 3:00 PM</td>
                          <td>Completed</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </>
              )}
            </div>
          </div>

          <div
            id="services"
            className="container services-section dash-services"
            style={{ marginTop: "110px", marginBottom: "70px" }}
          >
            <h2 className="text-center mb-4">Services</h2>
            <div className="row g-4">
              <div className="col-md-6 col-lg-4">
                <div className="card h-100">
                  <img src={genmain} className="card-img-top" alt="General Maintenance" />
                  <div className="card-body">
                    <h5 className="card-title">General Maintenance</h5>
                    <p className="card-text">
                      We handle routine repairs and upkeep to keep your property in top condition.
                    </p>
                  </div>
                </div>
              </div>

              <div className="col-md-6 col-lg-4">
                <div className="card h-100">
                  <img src={janitor} className="card-img-top" alt="Janitorial Services" />
                  <div className="card-body">
                    <h5 className="card-title">Janitorial and Cleaning Services</h5>
                    <p className="card-text">
                      Comprehensive cleaning services including offices and commercial spaces.
                    </p>
                  </div>
                </div>
              </div>

              <div className="col-md-6 col-lg-4">
                <div className="card h-100">
                  <img src={pest} className="card-img-top" alt="Pest Control" />
                  <div className="card-body">
                    <h5 className="card-title">Pest Control</h5>
                    <p className="card-text">
                      Effective and safe pest management solutions to protect your property.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <Footer />
        </div>

        {/* PROFILE SIDEBAR (Drawer) */}
        <div className={`profile-column ${isDrawerOpen ? "open" : ""}`}>
          <div className="profile-card">
            <h2 className="client-name">
              {user ? `${user.firstName} ${user.lastName}` : "Client"}
            </h2>

            <a
              href="#Bookings"
              className="profile-link"
              onClick={() => handleLinkClick("bookings")}
            >
              Bookings
            </a>

            <a
              href="#History"
              className="profile-link"
              onClick={() => handleLinkClick("history")}
            >
              History
            </a>

            <Link to="/booksys" className="profile-link" onClick={handleBookLinkClick}>
              Book
            </Link>

            <Link to="/Profile" className="profile-link" onClick={handleBookLinkClick}>
              Edit Profile
            </Link>

            <button
              className="profile-link btn-logout"
              onClick={() => {
                setShowLogoutConfirm(true);
                setIsDrawerOpen(false);
              }}
            >
              Log Out
            </button>
          </div>
        </div>
      </div>

      {/* LOGOUT CONFIRM MODAL */}
      {showLogoutConfirm && (
        <div className="logout-modal-backdrop">
          <div className="logout-modal">
            <h5>Are you sure you want to log out?</h5>
            <div className="logout-modal-buttons">
              <button
                className="btn btn-danger"
                onClick={() => {
                  localStorage.removeItem("auth_token");
                  setShowLogoutConfirm(false);
                  navigate("/");
                }}
              >
                Yes, I am
              </button>
              <button
                className="btn btn-secondary"
                onClick={() => setShowLogoutConfirm(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default CustomerDashb;

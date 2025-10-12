import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import genmain from "../assets/general-maintenance.jpg";
import janitor from "../assets/janitorial-services-1536x1024.jpg";
import pest from "../assets/pest-control-UT-hybridpestcontrol-scaled-2560x1280.jpeg";
import Footer from "../components/footer";
import axios from "axios";

interface Booking {
  booking_id: string;
  service: string;
  address: string;
  booking_date: string;
  status: string;
}

function CustomerDashb() {
  const [activeSection, setActiveSection] = useState<"bookings" | "history">("bookings");
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [user, setUser] = useState<{ id: string; firstName: string; lastName: string } | null>(null);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [history, setHistory] = useState<Booking[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("auth_token");
    if (!token) {
      navigate("/");
      return;
    }

    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
      fetchBookings(parsedUser.id);
    }
  }, [navigate]);

  const fetchBookings = async (userId: string) => {
    try {
      const response = await axios.get<Booking[]>(`http://localhost:3007/bookings/user/${userId}`);
      const allBookings = response.data;

      const activeBookings = allBookings.filter((b) => b.status !== "completed");
      const completedBookings = allBookings.filter((b) => b.status === "completed");

      setBookings(activeBookings);
      setHistory(completedBookings);
    } catch (err) {
      console.error("Error fetching bookings:", err);
    }
  };

  return (
    <>
      <nav className="navbar navbar-expand-lg my-navbar sticky-top">
        <div className="container-fluid">
          <a className="navbar-brand" href="#">
            GenClean
          </a>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarSupportedContent"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
        </div>
      </nav>

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
                          <th>Service</th>
                          <th>Address</th>
                          <th>Booking Date</th>
                          <th>Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {bookings.length > 0 ? (
                          bookings.map((b) => (
                            <tr key={b.booking_id}>
                              <td>{b.service}</td>
                              <td>{b.address}</td>
                              <td>{new Date(b.booking_date).toLocaleString()}</td>
                              <td>{b.status}</td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan={4}>No current bookings.</td>
                          </tr>
                        )}
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
                          <th>Service</th>
                          <th>Address</th>
                          <th>Booking Date</th>
                          <th>Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {history.length > 0 ? (
                          history.map((b) => (
                            <tr key={b.booking_id}>
                              <td>{b.service}</td>
                              <td>{b.address}</td>
                              <td>{new Date(b.booking_date).toLocaleString()}</td>
                              <td>{b.status}</td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan={4}>No completed bookings yet.</td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Services Section */}
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
                      We handle routine repairs, upkeep, and maintenance tasks to keep your property in top condition.
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
                      Comprehensive cleaning services including offices, buildings, and commercial spaces to maintain
                      hygiene and presentation.
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
                      Effective and safe pest management solutions to protect your property from unwanted infestations.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <Footer />
        </div>

        {/* Profile Column */}
        <div className="profile-column">
          <div className="profile-card">
            <h2 className="client-name">
              {user ? `${user.firstName} ${user.lastName}` : "Client"}
            </h2>

            <a href="#Bookings" className="profile-link" onClick={() => setActiveSection("bookings")}>
              Bookings
            </a>

            <a href="#History" className="profile-link" onClick={() => setActiveSection("history")}>
              History
            </a>

            <Link to="/booksys" className="profile-link">Book</Link>
            <Link to="/Profile" className="profile-link">Edit Profile</Link>

            <button className="profile-link btn-logout" onClick={() => setShowLogoutConfirm(true)}>
              Log Out
            </button>
          </div>
        </div>
      </div>

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
              <button className="btn btn-secondary" onClick={() => setShowLogoutConfirm(false)}>
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

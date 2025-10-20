/* eslint-disable @typescript-eslint/no-unused-vars */
import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";

import genmain from "../assets/general-maintenance.jpg";
import janitor from "../assets/janitorial-services-1536x1024.jpg";
import pest from "../assets/pest-control-UT-hybridpestcontrol-scaled-2560x1280.jpeg";
import Footer from "../components/footer";
import { Bell } from "lucide-react"; 

interface Booking {
  booking_id: string;
  service: string;
  address: string;
  booking_date: string;
  status: string;
}

interface Notification {
  notification_id: number;
  message: string;
  is_read: boolean;
  created_at: string;
}

function CustomerDashb() {
  const [activeSection, setActiveSection] = useState<"bookings" | "history">("bookings");
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [user, setUser] = useState<{ id: string; firstName: string; lastName: string } | null>(null);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [history, setHistory] = useState<Booking[]>([]);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  // 🔔 Notifications
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [showNotifications, setShowNotifications] = useState(false);

  const navigate = useNavigate();

  // ✅ Load data on mount
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
      fetchNotifications(parsedUser.id);

      // 🔁 Auto-refresh notifications every 10s
      const interval = setInterval(() => fetchNotifications(parsedUser.id), 10000);
      return () => clearInterval(interval);
    }
  }, [navigate]);

  const fetchBookings = async (userId: string) => {
    try {
      const response = await axios.get<Booking[]>(`http://localhost:3007/bookings/user/${userId}`);
      const allBookings = response.data;

      const activeBookings = allBookings.filter((b) => b.status.toLowerCase() !== "completed");
      const completedBookings = allBookings.filter((b) => b.status.toLowerCase() === "completed");

      setBookings(activeBookings);
      setHistory(completedBookings);
    } catch (err) {
      console.error("Error fetching bookings:", err);
    }
  };

  const fetchNotifications = async (userId: string) => {
    try {
      const res = await axios.get(`http://localhost:3007/notifications/${userId}`);
      if (Array.isArray(res.data)) {
        setNotifications(res.data);
      } else {
        setNotifications([]);
      }
    } catch (err) {
      console.error("Error fetching notifications:", err);
      setNotifications([]);
    }
  };

  const markAsRead = async (id: number) => {
    try {
      await axios.put(`http://localhost:3007/notifications/${id}/read`);
      setNotifications((prev) =>
        prev.map((n) => (n.notification_id === id ? { ...n, is_read: true } : n))
      );
    } catch (err) {
      console.error("Error marking notification as read:", err);
    }
  };

  const handleLinkClick = (section: "bookings" | "history") => {
    setActiveSection(section);
    setIsDrawerOpen(false);
  };

  const handleBookLinkClick = () => {
    setIsDrawerOpen(false);
  };

  // 🔢 Unread Notification Count
  const unreadCount = notifications.filter((n) => !n.is_read).length;

  return (
    <>
      {/* NAVBAR */}
      <nav className="navbar navbar-expand-lg my-navbar sticky-top">
        <div className="container-fluid d-flex justify-content-between align-items-center">
          <a className="navbar-brand" href="#">
            GenClean
          </a>

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

      {/* MAIN CONTENT */}
      <div className="dashboard-content">
        <div className="left-column-content">
          {/* BOOKINGS / HISTORY */}
          <div className="booked-services-column">
            <div className="booked-services-card">
              {activeSection === "bookings" ? (
                <>
                  <div className="d-flex align-items-center justify-content-between mb-3 position-relative">
                    <h1 className="booked-services-title mb-0" id="Bookings">
                      Booked Services
                    </h1>

                    {/* 🔔 Notification Bell with Count */}
                    <div className="position-relative">
                      <Bell
                        size={24}
                        className="cursor-pointer"
                        onClick={() => setShowNotifications(!showNotifications)}
                      />

                      {/* 🔢 Red badge for unread count */}
                      {unreadCount > 0 && (
                        <span
                          className="badge bg-danger position-absolute top-0 start-100 translate-middle rounded-circle"
                          style={{ fontSize: "0.7rem", padding: "4px 6px" }}
                        >
                          {unreadCount}
                        </span>
                      )}

                      {/* 🔔 Notification Dropdown */}
                      {showNotifications && (
                        <div
                          className="notification-box position-absolute end-0 mt-2 bg-white shadow rounded p-2"
                          style={{
                            width: "320px",
                            maxHeight: "300px",
                            overflowY: "auto",
                            zIndex: 1000,
                          }}
                        >
                          <h6 className="border-bottom pb-2">Notifications</h6>
                          {notifications.length === 0 ? (
                            <p className="text-muted small text-center mb-0">
                              No notifications yet.
                            </p>
                          ) : (
                            notifications.map((n) => (
                              <div
                                key={n.notification_id}
                                onClick={() => markAsRead(n.notification_id)}
                                className={`p-2 rounded mb-1 ${
                                  n.is_read ? "bg-light" : "bg-warning-subtle"
                                }`}
                                style={{ cursor: "pointer" }}
                              >
                                <p className="mb-1 fw-semibold">{n.message}</p>
                                <small className="text-muted">
                                  {new Date(n.created_at).toLocaleString()}
                                </small>
                              </div>
                            ))
                          )}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* BOOKINGS TABLE */}
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

          {/* SERVICES SECTION */}
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
                      Reliable pest management solutions for residential and commercial spaces.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <Footer />
        </div>

        {/* PROFILE SIDEBAR */}
        <div className={`profile-column ${isDrawerOpen ? "open" : ""}`}>
          <div className="profile-card">
            <h2 className="client-name">
              {user ? `${user.firstName} ${user.lastName}` : "Client"}
            </h2>

            <a href="#Bookings" className="profile-link" onClick={() => handleLinkClick("bookings")}>
              Bookings
            </a>

            <a href="#History" className="profile-link" onClick={() => handleLinkClick("history")}>
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

import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import "../admin.css";

function Admindashb() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [bookings, setBookings] = useState<any[]>([]);
  const [sales, setSales] = useState<any[]>([]);
  const [analytics, setAnalytics] = useState<any[]>([]);

  const bookingsRef = useRef<HTMLDivElement | null>(null);
  const salesRef = useRef<HTMLDivElement | null>(null);
  const analyticsRef = useRef<HTMLDivElement | null>(null);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  const scrollToRef = (ref: typeof bookingsRef) => {
    setIsSidebarOpen(false);
    ref.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  // Fetch data
  useEffect(() => {
    fetch("http://localhost:3007/bookings")
      .then((res) => res.json())
      .then((data) => setBookings(data))
      .catch((err) => console.error("Error fetching bookings:", err));

    fetch("http://localhost:3007/sales")
      .then((res) => res.json())
      .then((data) => setSales(data))
      .catch((err) => console.error("Error fetching sales:", err));

    fetch("http://localhost:3007/analytics")
      .then((res) => res.json())
      .then((data) => setAnalytics(data))
      .catch((err) => console.error("Error fetching analytics:", err));
  }, []);

  return (
    <div className="app-container">
      {/* Header */}
      <header className="app-header">
        <div className="header-inner">
          <a href="#" className="logo">
            <span>GenClean</span>
            <span className="logo-sub">Admin</span>
          </a>
          <button className="navbar-toggler" onClick={toggleSidebar}>
            ☰
          </button>
        </div>
      </header>

      {/* Sidebar */}
      <div className={`sidebar right-aligned ${isSidebarOpen ? "open" : ""}`}>
        <button className="close-btn" onClick={toggleSidebar}>
          &times;
        </button>
        <ul className="sidebar-nav">
          <li>
            <button onClick={() => scrollToRef(bookingsRef)}>
              Manage Bookings
            </button>
          </li>
          <li>
            <button onClick={() => scrollToRef(salesRef)}>
              Sales and Request
            </button>
          </li>
          <li>
            <button onClick={() => scrollToRef(analyticsRef)}>
              Customer Analytics
            </button>
          </li>
          <li>
            <Link to="/beforeafter">Before & After</Link>
          </li>
          <li>
            <button>Sign out</button>
          </li>
        </ul>
      </div>

      {/* Main */}
      <main className="app-main">
        {/* Bookings */}
        <div className="section-container" ref={bookingsRef}>
          <h2>Manage Bookings</h2>
          <div className="table-wrapper">
            <table className="analytics-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>User ID</th>
                  <th>Service</th>
                  <th>Booking Date</th>
                  <th>Address</th>
                  <th>Notes</th>
                  <th>For Assessment</th>
                  <th>Created At</th>
                </tr>
              </thead>
              <tbody>
                {bookings.length === 0 ? (
                  <tr>
                    <td colSpan={8} style={{ textAlign: "center" }}>
                      No bookings found
                    </td>
                  </tr>
                ) : (
                  bookings.map((b) => (
                    <tr key={b.id}>
                      <td>{b.id}</td>
                      <td>{b.user_id}</td>
                      <td>{b.service}</td>
                      <td>{new Date(b.booking_date).toLocaleDateString()}</td>
                      <td>{b.address}</td>
                      <td>{b.notes}</td>
                      <td>{b.for_assessment ? "Yes" : "No"}</td>
                      <td>
                        {b.created_at
                          ? new Date(b.created_at).toLocaleString()
                          : "N/A"}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          <div className="view-more">
            <Link to="/manageb">View More →</Link>
          </div>
        </div>

        {/* Sales */}
        <div className="section-container" ref={salesRef}>
          <h2>Sales and Request</h2>
          <div className="table-wrapper">
            <table className="analytics-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Customer</th>
                  <th>Service</th>
                  <th>Amount</th>
                  <th>Status</th>
                  <th>Created At</th>
                </tr>
              </thead>
              <tbody>
                {sales.length === 0 ? (
                  <tr>
                    <td colSpan={6} style={{ textAlign: "center" }}>
                      No sales data yet
                    </td>
                  </tr>
                ) : (
                  sales.map((s) => (
                    <tr key={s.id}>
                      <td>{s.id}</td>
                      <td>{s.customer}</td>
                      <td>{s.service}</td>
                      <td>{s.amount}</td>
                      <td className="capitalize">{s.status}</td>
                      <td>
                        {s.created_at
                          ? new Date(s.created_at).toLocaleString()
                          : "N/A"}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          <div className="view-more">
            <Link to="/salesandreq">View More →</Link>
          </div>
        </div>

        {/* Analytics */}
        <div className="section-container" ref={analyticsRef}>
          <h2>Customer Analytics</h2>
          <div className="table-wrapper">
            <table className="analytics-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Customer</th>
                  <th>Total Bookings</th>
                  <th>Total Spent</th>
                  <th>Last Booking</th>
                </tr>
              </thead>
              <tbody>
                {analytics.length === 0 ? (
                  <tr>
                    <td colSpan={5} style={{ textAlign: "center" }}>
                      No analytics data yet
                    </td>
                  </tr>
                ) : (
                  analytics.map((a) => (
                    <tr key={a.id}>
                      <td>{a.id}</td>
                      <td>{a.customer}</td>
                      <td>{a.total_bookings}</td>
                      <td>{a.total_spent}</td>
                      <td>
                        {a.last_booking
                          ? new Date(a.last_booking).toLocaleDateString()
                          : "N/A"}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          <div className="view-more">
            <Link to="/analytics">View More →</Link>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="app-footer">
        &copy; {new Date().getFullYear()} GenClean Admin Dashboard
      </footer>
    </div>
  );
}

export default Admindashb;
import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import "../admin.css";

function Admindashb() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [bookings, setBookings] = useState<any[]>([]);
  const [sales, setSales] = useState<any[]>([]);
  const [analytics, setAnalytics] = useState<any[]>([]);
  const [selectedMonth, setSelectedMonth] = useState<number>(new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState<number>(new Date().getFullYear());

  const bookingsRef = useRef<HTMLDivElement | null>(null);
  const salesRef = useRef<HTMLDivElement | null>(null);
  const analyticsRef = useRef<HTMLDivElement | null>(null);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
  const scrollToRef = (ref: typeof bookingsRef) => {
    setIsSidebarOpen(false);
    ref.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  // Fetch data from backend (REALTIME REFRESH)
  useEffect(() => {
    const fetchAllData = async () => {
      try {
        // Requests (Bookings)
        const bookingsRes = await fetch("http://localhost:3007/bookings");
        const bookingsData = await bookingsRes.json();
        setBookings(bookingsData);

        // Sales
        const salesRes = await fetch("http://localhost:3007/sales");
        const salesData = await salesRes.json();
        setSales(salesData);

        // Analytics
        const analyticsRes = await fetch(
          `http://localhost:3007/analytics_summary?month=${selectedMonth}&year=${selectedYear}`
        );
        const analyticsData = await analyticsRes.json();
        setAnalytics(analyticsData);
      } catch (err) {
        console.error("❌ Error fetching dashboard data:", err);
      }
    };

    fetchAllData();
    const interval = setInterval(fetchAllData, 5000);
    return () => clearInterval(interval);
  }, [selectedMonth, selectedYear]);

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
            <button onClick={() => scrollToRef(bookingsRef)}>Manage Bookings</button>
          </li>
          <li>
            <button onClick={() => scrollToRef(salesRef)}>Sales and Request</button>
          </li>
          <li>
            <button onClick={() => scrollToRef(analyticsRef)}>Customer Analytics</button>
          </li>
          <li>
            <Link to="/beforeafter">Before & After</Link>
          </li>
          <li>
            <button>Sign out</button>
          </li>
        </ul>
      </div>

      {/* Main Content */}
      <main className="app-main">
        {/* Manage Bookings Section */}
        <div className="section-container" ref={bookingsRef}>
          <h2>Manage Bookings</h2>
          <div className="table-wrapper">
            <table className="analytics-table">
              <thead>
                <tr>
                  <th>Booking ID</th>
                  <th>User ID</th>
                  <th>Name</th>
                  <th>Service</th>
                  <th>Booking Date</th>
                  <th>Address</th>
                  <th>Notes</th>
                  <th>For Assessment</th>
                  <th>Created At</th>
                  <th>Payment</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {bookings.length === 0 ? (
                  <tr>
                    <td colSpan={11} style={{ textAlign: "center" }}>
                      No bookings found
                    </td>
                  </tr>
                ) : (
                  bookings.map((b) => (
                    <tr key={b.booking_id}>
                      <td>{b.booking_id}</td>
                      <td>{b.user_id}</td>
                      <td>{b.name || "—"}</td>
                      <td>{b.service}</td>
                      <td>{b.booking_date ? new Date(b.booking_date).toLocaleDateString() : "N/A"}</td>
                      <td>{b.address}</td>
                      <td>{b.notes || "—"}</td>
                      <td>{b.for_assessment ? "✅" : "❌"}</td>
                      <td>{b.created_at ? new Date(b.created_at).toLocaleString() : "N/A"}</td>
                      <td>{b.payment ? `₱${b.payment}` : "—"}</td>
                      <td>{b.status || "Pending"}</td>
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

        {/* Sales and Request Section */}
        <div className="section-container" ref={salesRef}>
          <h2>Sales and Request</h2>
          <div className="dual-table-container">
            {/* Sales Table */}
            <div className="table-box">
              <h3>Sales</h3>
              <div className="table-wrapper">
                <table className="analytics-table">
                  <thead>
                    <tr>
                      <th>Sale ID</th>
                      <th>User ID</th>
                      <th>Service</th>
                      <th>Payment</th>
                      <th>Status</th>
                      <th>Completed At</th>
                      <th>Created At</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sales.length === 0 ? (
                      <tr>
                        <td colSpan={7} style={{ textAlign: "center" }}>
                          No sales data yet
                        </td>
                      </tr>
                    ) : (
                      sales.map((s) => (
                        <tr key={s.sale_id}>
                          <td>{s.sale_id}</td>
                          <td>{s.user_id}</td>
                          <td>{s.service}</td>
                          <td>{s.payment ? `₱${s.payment}` : "—"}</td>
                          <td className="capitalize">{s.status}</td>
                          <td>{s.completed_at ? new Date(s.completed_at).toLocaleString() : "N/A"}</td>
                          <td>{s.created_at ? new Date(s.created_at).toLocaleString() : "N/A"}</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Requests Table */}
            <div className="table-box">
              <h3>Requests</h3>
              <div className="table-wrapper">
                <table className="analytics-table">
                  <thead>
                    <tr>
                      <th>Request ID</th>
                      <th>Booking ID</th>
                      <th>User ID</th>
                      <th>Service</th>
                      <th>Address</th>
                      <th>Status</th>
                      <th>Created At</th>
                      <th>Booking Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {bookings.filter(b => b.status !== "completed").length === 0 ? (
                      <tr>
                        <td colSpan={8} style={{ textAlign: "center" }}>
                          No requests found
                        </td>
                      </tr>
                    ) : (
                      bookings
                        .filter(b => b.status !== "completed")
                        .map((r) => (
                          <tr key={r.request_id || r.booking_id}>
                            <td>{r.request_id || "—"}</td>
                            <td>{r.booking_id}</td>
                            <td>{r.user_id}</td>
                            <td>{r.service}</td>
                            <td>{r.address}</td>
                            <td className="capitalize">{r.status || "Pending"}</td>
                            <td>{r.created_at ? new Date(r.created_at).toLocaleString() : "N/A"}</td>
                            <td>{r.booking_date ? new Date(r.booking_date).toLocaleDateString() : "N/A"}</td>
                          </tr>
                        ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <div className="view-more">
            <Link to="/salesandreq">View More →</Link>
          </div>
        </div>

        {/* Customer Analytics Section */}
        <div className="section-container" ref={analyticsRef}>
          <h2>Customer Analytics</h2>

          {/* Month & Year Filter */}
          <div style={{ display: "flex", gap: "20px", marginBottom: "15px", alignItems: "center" }}>
            <div>
              <label htmlFor="monthSelect"><strong>Select Month:</strong> </label>
              <select
                id="monthSelect"
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(Number(e.target.value))}
              >
                {Array.from({ length: 12 }, (_, i) => (
                  <option key={i + 1} value={i + 1}>
                    {new Date(0, i).toLocaleString("default", { month: "long" })}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="yearInput"><strong>Enter Year:</strong> </label>
              <input
                type="number"
                id="yearInput"
                value={selectedYear}
                min="2000"
                max="2100"
                onChange={(e) => setSelectedYear(Number(e.target.value))}
                style={{ width: "100px", textAlign: "center" }}
              />
            </div>
          </div>

          <div className="table-wrapper">
            <table className="analytics-table">
              <thead>
                <tr>
                  <th>Service</th>
                  <th>Total Bookings</th>
                  <th>Total Amount (₱)</th>
                  <th>Completed At</th>
                </tr>
              </thead>
              <tbody>
                {analytics.length === 0 ? (
                  <tr>
                    <td colSpan={4} style={{ textAlign: "center" }}>
                      No analytics summary data yet
                    </td>
                  </tr>
                ) : (
                  analytics.map((a, index) => (
                    <tr key={index}>
                      <td>{a.service}</td>
                      <td>{a.total_bookings}</td>
                      <td>₱{Number(a.total_amount).toLocaleString()}</td>
                      <td>{a.completed_at ? new Date(a.completed_at).toLocaleDateString() : "N/A"}</td>
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

      <footer className="app-footer">
        &copy; {new Date().getFullYear()} GenClean Admin Dashboard
      </footer>
    </div>
  );
}

export default Admindashb;

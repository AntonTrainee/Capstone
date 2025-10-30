import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { io, Socket } from "socket.io-client";
import "../admin.css";

interface Booking {
  booking_id: number;
  user_id: number;
  name?: string;
  service: string;
  booking_date?: string;
  address: string;
  notes?: string;
  for_assessment?: boolean;
  created_at?: string;
  payment?: number;
  status?: string;
}

interface Sale {
  sale_id: number;
  user_id: number;
  service: string;
  payment?: number;
  status: string;
  completed_at?: string;
  created_at?: string;
}

interface AnalyticsSummary {
  service: string;
  total_bookings: number;
  total_amount: number;
  completed_at?: string;
}

function Admindashb() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [sales, setSales] = useState<Sale[]>([]);
  const [analytics, setAnalytics] = useState<AnalyticsSummary[]>([]);
  const [loadingAnalytics, setLoadingAnalytics] = useState(true);

  const bookingsRef = useRef<HTMLDivElement | null>(null);
  const salesRef = useRef<HTMLDivElement | null>(null);
  const analyticsRef = useRef<HTMLDivElement | null>(null);

  const navigate = useNavigate();
  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
  const scrollToRef = (ref: typeof bookingsRef) => {
    setIsSidebarOpen(false);
    ref.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const handleSignOut = () => {
    if (window.confirm("Are you sure you want to sign out?")) {
      localStorage.removeItem("auth_token");
      localStorage.removeItem("user");
      sessionStorage.removeItem("auth_token");
      sessionStorage.removeItem("user");
      navigate("/", { replace: true });
    }
  };

  useEffect(() => {
    // --- Initial fetch ---
    const fetchInitialData = async () => {
      try {
        const [bookingsRes, salesRes] = await Promise.all([
          fetch("https://capstone-ni5z.onrender.com/bookings"),
          fetch("https://capstone-ni5z.onrender.com/sales"),
        ]);

        const bookingsData: Booking[] = await bookingsRes.json();
        const salesData: Sale[] = await salesRes.json();
        setBookings(Array.isArray(bookingsData) ? bookingsData : []);
        setSales(Array.isArray(salesData) ? salesData : []);

        // Analytics summary for current month
        setLoadingAnalytics(true);
        const today = new Date();
        const firstDay = new Date(today.getFullYear(), today.getMonth(), 1)
          .toISOString()
          .split("T")[0];
        const lastDay = new Date(today.getFullYear(), today.getMonth() + 1, 0)
          .toISOString()
          .split("T")[0];

        const analyticsRes = await fetch(
          `https://capstone-ni5z.onrender.com/analytics_summary?from=${firstDay}&to=${lastDay}`
        );
        const analyticsData: AnalyticsSummary[] = await analyticsRes.json();
        setAnalytics(Array.isArray(analyticsData) ? analyticsData : []);
      } catch (err) {
        console.error(err);
        setBookings([]);
        setSales([]);
        setAnalytics([]);
      } finally {
        setLoadingAnalytics(false);
      }
    };

    fetchInitialData();

    // --- Socket.IO real-time updates ---
    const socket: Socket = io("https://capstone-ni5z.onrender.com");

    socket.on("connect", () => console.log("⚡ Connected to Socket.IO"));

    // Update bookings table
    socket.on("bookings_update", (rows: Booking[]) => {
      console.log("📌 Bookings updated:", rows);
      setBookings(Array.isArray(rows) ? rows : []);
    });

    // Update sales table
    socket.on("sales_update", (rows: Sale[]) => {
      console.log("💰 Sales updated:", rows);
      setSales(Array.isArray(rows) ? rows : []);
    });

    // Update analytics summary table
    socket.on("analytics_update", (rows: AnalyticsSummary[]) => {
      console.log("📊 Analytics updated:", rows);
      setAnalytics(
        Array.isArray(rows)
          ? rows.map((row) => ({
              service: row.service,
              total_bookings: row.total_bookings,
              total_amount: row.total_amount,
              completed_at: row.completed_at || undefined,
            }))
          : []
      );
      setLoadingAnalytics(false);
    });

    return () => {
      socket.disconnect();
    };
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
      <div className={`sidebar ${isSidebarOpen ? "open" : ""}`}>
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
            <button onClick={() => scrollToRef(salesRef)}>Sales and Request</button>
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
            <Link to="/admin-reviews">Change Reviews</Link>
          </li>
          <li>
            <button className="btn-logout" onClick={handleSignOut}>
              Sign out
            </button>
          </li>
        </ul>
      </div>

      {/* Main Content */}
      <main className="app-main">
        {/* Manage Bookings */}
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
                  <th>Booking Date & Time</th>
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
                      <td>
                        {b.booking_date
                          ? new Date(b.booking_date).toLocaleString()
                          : "N/A"}
                      </td>
                      <td>{b.address}</td>
                      <td>{b.notes || "—"}</td>
                      <td>{b.for_assessment ? "✅" : "❌"}</td>
                      <td>
                        {b.created_at
                          ? new Date(b.created_at).toLocaleString()
                          : "N/A"}
                      </td>
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

        {/* Sales and Request */}
        <div className="section-container" ref={salesRef}>
          <h2>Sales and Request</h2>
          <div className="dual-table-container">
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
                          <td>
                            {s.completed_at
                              ? new Date(s.completed_at).toLocaleString()
                              : "N/A"}
                          </td>
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
            </div>

            <div className="table-box">
              <h3>Requests</h3>
              <div className="table-wrapper">
                <table className="analytics-table">
                  <thead>
                    <tr>
                      <th>Booking ID</th>
                      <th>User ID</th>
                      <th>Service</th>
                      <th>Address</th>
                      <th>Status</th>
                      <th>Created At</th>
                      <th>Booking Date & Time</th>
                    </tr>
                  </thead>
                  <tbody>
                    {bookings.filter((b) => b.status !== "completed").length === 0 ? (
                      <tr>
                        <td colSpan={7} style={{ textAlign: "center" }}>
                          No requests found
                        </td>
                      </tr>
                    ) : (
                      bookings
                        .filter((b) => b.status !== "completed")
                        .map((r) => (
                          <tr key={r.booking_id}>
                            <td>{r.booking_id}</td>
                            <td>{r.user_id}</td>
                            <td>{r.service}</td>
                            <td>{r.address}</td>
                            <td className="capitalize">{r.status || "Pending"}</td>
                            <td>
                              {r.created_at
                                ? new Date(r.created_at).toLocaleString()
                                : "N/A"}
                            </td>
                            <td>
                              {r.booking_date
                                ? new Date(r.booking_date).toLocaleString()
                                : "N/A"}
                            </td>
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

        {/* Customer Analytics */}
        <div className="section-container" ref={analyticsRef}>
          <h2>Customer Analytics Summary</h2>
          {loadingAnalytics ? (
            <p>Loading table data...</p>
          ) : (
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
                        No summary data available
                      </td>
                    </tr>
                  ) : (
                    analytics.map((row, index) => (
                      <tr key={index}>
                        <td>{row.service}</td>
                        <td>{row.total_bookings}</td>
                        <td>₱{Number(row.total_amount).toLocaleString()}</td>
                        <td>
                          {row.completed_at
                            ? new Date(row.completed_at).toLocaleString()
                            : "N/A"}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}
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

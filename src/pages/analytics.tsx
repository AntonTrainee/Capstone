import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import "../analytics.css";

type Summary = {
  service: string;
  total_bookings: number;
  total_amount: number;
  completed_at: string;
};

export default function Analytics() {
  const [summary, setSummary] = useState<Summary[]>([]);
  const [loading, setLoading] = useState(true);

  // For date filter
  const [fromDate, setFromDate] = useState<string>("");
  const [toDate, setToDate] = useState<string>("");

  // Fetch analytics data
  const fetchSummary = async (from?: string, to?: string) => {
    setLoading(true);
    try {
      let url = "https://capstone-ni5z.onrender.com/analytics_summary";
      if (from && to) {
        url += `?from=${from}&to=${to}`;
      }

      const res = await fetch(url);
      const data = await res.json();
      setSummary(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Error fetching summary:", err);
      setSummary([]);
    } finally {
      setLoading(false);
    }
  };

  // Default fetch on mount (current month)
  useEffect(() => {
    const today = new Date();
    const firstDay = new Date(today.getFullYear(), today.getMonth(), 1)
      .toISOString()
      .split("T")[0];
    const lastDay = new Date(today.getFullYear(), today.getMonth() + 1, 0)
      .toISOString()
      .split("T")[0];

    setFromDate(firstDay);
    setToDate(lastDay);
    fetchSummary(firstDay, lastDay);
  }, []);

  // ✅ Real-time updates via Socket.IO
  useEffect(() => {
    const socket = io("https://capstone-ni5z.onrender.com");

    socket.on("connect", () => console.log("✅ Connected to analytics socket"));

    // Listen for analytics updates
    socket.on("analytics_update", (updatedData: Summary[]) => {
      console.log("📊 Realtime analytics update received:", updatedData);
      setSummary(updatedData);
    });

    socket.on("disconnect", () => console.log("❌ Disconnected from analytics socket"));

    return () => {
      socket.disconnect();
    };
  }, []);

  // Handle manual date filter
  const handleApplyFilter = () => {
    if (!fromDate || !toDate) {
      alert("Please select both From and To dates before applying the filter.");
      return;
    }
    fetchSummary(fromDate, toDate);
  };

  return (
    <div className="app-container">
      {/* Header */}
      <header className="app-header">
        <div className="header-inner">
          <div className="logo">
            <span className="logo-main">GenClean</span>
            <span className="logo-sub">Analytics Summary</span>
          </div>
        </div>
      </header>

      {/* Main */}
      <main className="app-main">
        {/* Hero */}
        <section className="analytics-hero">
          <div>
            <h1>Service Analytics</h1>
            <p>Overview of total bookings and revenue per service type.</p>
          </div>

          {/* Optional Date Filter */}
          <div className="filter-controls">
            <div className="date-filter-group">
              <label>From: </label>
              <input
                type="date"
                value={fromDate}
                onChange={(e) => setFromDate(e.target.value)}
              />
              <label>To: </label>
              <input
                type="date"
                value={toDate}
                onChange={(e) => setToDate(e.target.value)}
              />
              <button onClick={handleApplyFilter}>Apply Filter</button>
            </div>
          </div>
        </section>

        {/* Chart */}
        <section>
          <h2>Visualization: Total Bookings & Revenue by Service</h2>
          {loading ? (
            <p>Loading analytics...</p>
          ) : (
            <div className="chart-wrapper">
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={summary}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="service" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="total_bookings" fill="#38bdf8" name="Total Bookings" />
                  <Bar dataKey="total_amount" fill="#6366f1" name="Revenue" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </section>

        {/* Table */}
        <section>
          <h2>Analytics Summary Table</h2>
          {loading ? (
            <p>Loading table data...</p>
          ) : (
            <div className="table-wrapper">
              <table className="analytics-table">
                <thead>
                  <tr>
                    <th>Service</th>
                    <th>Total Bookings</th>
                    <th>Revenue</th>
                    <th>Recent Completion</th>
                  </tr>
                </thead>
                <tbody>
                  {summary.length === 0 ? (
                    <tr>
                      <td colSpan={4} style={{ textAlign: "center" }}>
                        No summary data available
                      </td>
                    </tr>
                  ) : (
                    summary.map((row, index) => (
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
        </section>
      </main>

      <footer className="app-footer">
        © {new Date().getFullYear()} GenClean
      </footer>
    </div>
  );
}

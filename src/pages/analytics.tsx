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
  const [selectedMonth, setSelectedMonth] = useState<number>(
    new Date().getMonth() + 1
  );

  // Function to fetch data manually (used for first load and month change)
  const fetchSummary = async (month: number) => {
    setLoading(true);
    try {
      const res = await fetch(
        `https://capstone-ni5z.onrender.com/analytics_summary?month=${month}`
      );
      const data = await res.json();
      setSummary(data);
    } catch (err) {
      console.error("Error fetching summary:", err);
    } finally {
      setLoading(false);
    }
  };

  // Load initial summary when component mounts or month changes
  useEffect(() => {
    fetchSummary(selectedMonth);
  }, [selectedMonth]);

  // ✅ Realtime updates via Socket.IO
  useEffect(() => {
    const socket = io("https://capstone-ni5z.onrender.com");

    socket.on("connect", () => {
      console.log("✅ Connected to analytics socket");
    });

    // Listen for updates pushed by backend
    socket.on("analytics_update", (updatedData: Summary[]) => {
      console.log("📊 Realtime analytics update received:", updatedData);
      setSummary(updatedData);
    });

    socket.on("disconnect", () => {
      console.log("❌ Disconnected from analytics socket");
    });

    // Cleanup on unmount
    return () => {
      socket.disconnect();
    };
  }, []);

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
        <section className="analytics-hero">
          <div>
            <h1>Service Analytics</h1>
            <p>Overview of total bookings and revenue per service type.</p>
          </div>

          {/* Month Filter */}
          <div className="filter-controls">
            <label htmlFor="month">Filter by Month: </label>
            <select
              id="month"
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(Number(e.target.value))}
            >
              {[
                "January",
                "February",
                "March",
                "April",
                "May",
                "June",
                "July",
                "August",
                "September",
                "October",
                "November",
                "December",
              ].map((month, index) => (
                <option key={index + 1} value={index + 1}>
                  {month}
                </option>
              ))}
            </select>
          </div>
        </section>

        {/* Chart */}
        <section>
          <h2>Visualization: Total Bookings & Revenue by Service</h2>
          {loading ? (
            <p>Loading analytics...</p>
          ) : (
            <div className="chart-wrapper">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={summary}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="service" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar
                    dataKey="total_bookings"
                    fill="#38bdf8"
                    name="Total Bookings"
                  />
                  <Bar
                    dataKey="total_amount"
                    fill="#6366f1"
                    name="Total Amount (₱)"
                  />
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
                    <th>Total Amount (₱)</th>
                    <th>Completed At</th>
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
                    summary.map((row) => (
                      <tr key={row.service + row.completed_at}>
                        <td>{row.service}</td>
                        <td>{row.total_bookings}</td>
                        <td>₱{row.total_amount.toLocaleString()}</td>
                        <td>
                          {new Date(row.completed_at).toLocaleDateString()}
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

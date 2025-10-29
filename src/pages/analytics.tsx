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
  const [fromDate, setFromDate] = useState<string>("");
  const [toDate, setToDate] = useState<string>("");

  // === Fetch data by date range ===
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
    } finally {
      setLoading(false);
    }
  };

  // Load initial summary when component mounts
  useEffect(() => {
    fetchSummary();
  }, []);

  // Refetch whenever date filters change
  useEffect(() => {
    if (fromDate && toDate) {
      fetchSummary(fromDate, toDate);
    }
  }, [fromDate, toDate]);

  // === Real-time updates via Socket.IO ===
  useEffect(() => {
    const socket = io("https://capstone-ni5z.onrender.com");

    socket.on("connect", () => {
      console.log("✅ Connected to analytics socket");
    });

    socket.on("analytics_update", (updatedData: Summary[]) => {
      console.log("📊 Realtime analytics update received:", updatedData);
      setSummary(Array.isArray(updatedData) ? updatedData : []);
    });

    socket.on("disconnect", () => {
      console.log("❌ Disconnected from analytics socket");
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
          <div className="logo">
            <span className="logo-main">GenClean</span>
            <span className="logo-sub">Analytics Summary</span>
          </div>
        </div>
      </header>

      {/* Main */}
      <main className="app-main">
        {/* Hero Section */}
        <section className="analytics-hero">
          <div>
            <h1>Service Analytics</h1>
            <p>Monitor total bookings and revenue within a date range.</p>
          </div>

          {/* Date Range Filter */}
          <div className="filter-controls">
            <label htmlFor="from">From: </label>
            <input
              id="from"
              type="date"
              value={fromDate}
              onChange={(e) => setFromDate(e.target.value)}
            />
            <label htmlFor="to">To: </label>
            <input
              id="to"
              type="date"
              value={toDate}
              onChange={(e) => setToDate(e.target.value)}
            />
            <button
              className="refresh-btn"
              onClick={() => fetchSummary(fromDate, toDate)}
              disabled={!fromDate || !toDate}
            >
              Apply Filter
            </button>
          </div>
        </section>

        {/* Chart */}
        <section>
          <h2>Visualization: Total Bookings & Revenue by Service</h2>
          {loading ? (
            <p>Loading analytics...</p>
          ) : summary.length === 0 ? (
            <p>No data available for the selected range.</p>
          ) : (
            <div className="chart-wrapper">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={summary}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="service" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="total_bookings" fill="#38bdf8" name="Total Bookings" />
                  <Bar dataKey="total_amount" fill="#6366f1" name="Total Amount (₱)" />
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
          ) : summary.length === 0 ? (
            <p>No summary data available.</p>
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
                  {summary.map((row, idx) => (
                    <tr key={idx}>
                      <td>{row.service}</td>
                      <td>{row.total_bookings}</td>
                      <td>₱{Number(row.total_amount).toLocaleString()}</td>
                      <td>{new Date(row.completed_at).toLocaleString()}</td>
                    </tr>
                  ))}
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

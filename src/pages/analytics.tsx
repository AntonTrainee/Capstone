import { useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";
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
  completed_at?: string;
};

export default function Analytics() {
  const [summary, setSummary] = useState<Summary[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedMonth, setSelectedMonth] = useState<number>(
    new Date().getMonth() + 1
  );

  const fetchSummary = async (month: number) => {
    setLoading(true);
    try {
      const year = new Date().getFullYear();
      const firstDay = new Date(year, month - 1, 1)
        .toISOString()
        .split("T")[0];
      const lastDay = new Date(year, month, 0)
        .toISOString()
        .split("T")[0];

      console.log("📅 Fetching data for:", { firstDay, lastDay, month, year });

      const res = await fetch(
        `https://capstone-ni5z.onrender.com/analytics_summary?from=${firstDay}&to=${lastDay}`
      );
      
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      
      const data: Summary[] = await res.json();
      console.log("📊 Received data:", data);
      
      setSummary(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("❌ Error fetching summary:", err);
      setSummary([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSummary(selectedMonth);

    // Socket.IO real-time updates - only for current month
    const socket: Socket = io("https://capstone-ni5z.onrender.com");
    
    socket.on("connect", () => {
      console.log("⚡ Connected to Socket.IO");
    });

    socket.on("analytics_update", (rows: Summary[]) => {
      console.log("📈 Real-time analytics update received:", rows);
      
      // Only update if we're viewing the current month
      const currentMonth = new Date().getMonth() + 1;
      if (selectedMonth === currentMonth) {
        setSummary(
          Array.isArray(rows)
            ? rows.map((row) => ({
                service: row.service,
                total_bookings: row.total_bookings,
                total_amount: row.total_amount,
                completed_at: row.completed_at || undefined,
              }))
            : []
        );
      }
    });

    socket.on("disconnect", () => {
      console.log("❌ Disconnected from Socket.IO");
    });

    socket.on("connect_error", (error) => {
      console.error("🔴 Socket connection error:", error);
    });

    return () => {
      socket.disconnect();
    };
  }, [selectedMonth]);

  return (
    <div className="app-container">
      <header className="app-header">
        <div className="header-inner">
          <div className="logo">
            <span className="logo-main">GenClean</span>
            <span className="logo-sub">Analytics Summary</span>
          </div>
        </div>
      </header>

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
          ) : summary.length === 0 ? (
            <div style={{ padding: "2rem", textAlign: "center", color: "#666" }}>
              <p>No data available for the selected month.</p>
              <p style={{ fontSize: "0.9rem", marginTop: "0.5rem" }}>
                Make sure you have completed bookings in the sales table.
              </p>
            </div>
          ) : (
            <div className="chart-wrapper">
              <ResponsiveContainer width="100%" height={400}>
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
                    <th>Last Completed</th>
                  </tr>
                </thead>
                <tbody>
                  {summary.length === 0 ? (
                    <tr>
                      <td colSpan={4} style={{ textAlign: "center", padding: "2rem" }}>
                        No summary data available for this month
                      </td>
                    </tr>
                  ) : (
                    summary.map((row, index) => (
                      <tr key={`${row.service}-${index}`}>
                        <td>{row.service}</td>
                        <td>{row.total_bookings}</td>
                        <td>₱{Number(row.total_amount).toLocaleString()}</td>
                        <td>
                          {row.completed_at
                            ? new Date(row.completed_at).toLocaleDateString()
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

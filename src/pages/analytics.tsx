import { useEffect, useState, useCallback } from "react";
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
  completed_at?: string; // optional for backend null
};

export default function Analytics() {
  const [summary, setSummary] = useState<Summary[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedMonth, setSelectedMonth] = useState<number>(
    new Date().getMonth() + 1
  ); // default: current month

  // Fetch summary data
  const fetchSummary = useCallback(async (month: number) => {
    setLoading(true);
    try {
      const year = new Date().getFullYear();
      const firstDay = new Date(year, month - 1, 1).toISOString().split("T")[0];
      const lastDay = new Date(year, month, 0).toISOString().split("T")[0];

      const res = await fetch(
        `https://capstone-ni5z.onrender.com/analytics_summary?from=${firstDay}&to=${lastDay}`
      );
      const data: Summary[] = await res.json();
      setSummary(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Error fetching summary:", err);
      setSummary([]);
    } finally {
      setLoading(false);
    }
  }, []);

  // Socket.IO real-time updates (runs once)
  useEffect(() => {
    const socket: Socket = io("https://capstone-ni5z.onrender.com");

    socket.on("connect", () => console.log("⚡ Connected to Socket.IO"));

    socket.on("analytics_update", (rows: Summary[]) => {
      console.log("📈 Real-time analytics update:", rows);
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
      setLoading(false);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  // Fetch summary whenever selectedMonth changes
  useEffect(() => {
    fetchSummary(selectedMonth);
  }, [selectedMonth, fetchSummary]);

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

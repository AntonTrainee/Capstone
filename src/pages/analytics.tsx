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

// Assuming "analytics.css" contains necessary styles

type Summary = {
  service: string;
  total_bookings: number;
  total_amount: number;
  completed_at?: string;
};

// Helper function to format currency
const formatCurrency = (amount: number) =>
  `₱${Number(amount).toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;

export default function Analytics() {
  const [summary, setSummary] = useState<Summary[]>([]);
  const [loading, setLoading] = useState(true);

  // Function to fetch summary data for the CURRENT month
  const fetchSummary = async () => {
    setLoading(true);
    try {
      // Calculate the date range for the current month
      const today = new Date();
      const year = today.getFullYear();
      // month is 1-indexed (e.g., 9 for September)
      const month = today.getMonth() + 1; 

      // First day of the current month
      const firstDay = new Date(year, month - 1, 1)
        .toISOString()
        .split("T")[0];
      // Last day of the current month (day 0 of the next month)
      const lastDay = new Date(year, month, 0)
        .toISOString()
        .split("T")[0];

      console.log("📅 Fetching data for current month:", { firstDay, lastDay, month, year });

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
    // Fetch data for the current month immediately on load
    fetchSummary();

    // Socket.IO real-time updates - now dedicated to the current month's data
    const socket: Socket = io("https://capstone-ni5z.onrender.com");
    
    socket.on("connect", () => {
      console.log("⚡ Connected to Socket.IO");
    });

    socket.on("analytics_update", (rows: Summary[]) => {
      console.log("📈 Real-time analytics update received:", rows);
      
      // Update the summary directly, as this component now only displays the current month.
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
    });

    socket.on("disconnect", () => {
      console.log("❌ Disconnected from Socket.IO");
    });

    socket.on("connect_error", (error) => {
      console.error("🔴 Socket connection error:", error);
    });

    // Clean up the socket connection on component unmount
    return () => {
      socket.disconnect();
    };
  }, []); // Empty dependency array means this runs only once on mount

  // Determine the current month name for the header (for display purposes)
  const currentMonthName = new Date().toLocaleString('default', { month: 'long', year: 'numeric' });

  return (
    <div className="app-container">
      <header className="app-header">
        <div className="header-inner">
          <div className="logo">
            <span className="logo-main">GenClean</span>
            <span className="logo-sub">Analytics Summary - {currentMonthName}</span>
          </div>
        </div>
      </header>

      <main className="app-main">
        <section className="analytics-hero">
          <div>
            <h1>Service Analytics</h1>
            <p>Overview of total bookings and revenue per service type for the current month.</p>
          </div>
          {/* The Month Filter UI has been safely removed here */}
        </section>

        {/* Chart */}
        <section>
          <h2>Visualization: Total Bookings & Revenue by Service</h2>
          {loading ? (
            <p>Loading analytics...</p>
          ) : summary.length === 0 ? (
            <div style={{ padding: "2rem", textAlign: "center", color: "#666" }}>
              <p>No data available for the current month ({currentMonthName}).</p>
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
                  <Tooltip formatter={(value, name) => [name === 'Total Amount (₱)' ? formatCurrency(Number(value)) : value, name]}/>
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
                        <td>{formatCurrency(row.total_amount)}</td>
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
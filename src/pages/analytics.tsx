import { useEffect, useState } from "react";
import "../analytics.css";

type Analytics = {
  id: number;
  customer: string;
  total_bookings: number;
  total_spent: number;
  last_booking: string; // timestamptz
  user_id: number;
  most_booked_service: string;
  created_at: string; // timestamptz
};

export default function Analytics() {
  const [analytics, setAnalytics] = useState<Analytics[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://localhost:3007/analytics")
      .then((res) => res.json())
      .then((data) => {
        setAnalytics(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching analytics:", err);
        setLoading(false);
      });
  }, []);

  return (
    <div className="app-container">
      <header className="app-header">
        <div className="header-inner">
          <div className="logo">
            <span className="logo-main">GenClean</span>
            <span className="logo-sub">Analytics</span>
          </div>
        </div>
      </header>

      <main className="app-main">
        <section className="analytics-hero">
          <div>
            <h1>Customer Analytics</h1>
            <p>Track customer spending and booking history.</p>
          </div>
        </section>

        <section>
          <h2>Customer Analytics Table</h2>
          {loading ? (
            <p>Loading analytics...</p>
          ) : (
            <div className="table-wrapper">
              <table className="analytics-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Customer</th>
                    <th>Total Bookings</th>
                    <th>Total Spent</th>
                    <th>Last Booking</th>
                    <th>User ID</th>
                    <th>Most Booked Service</th>
                    <th>Created At</th>
                  </tr>
                </thead>
                <tbody>
                  {analytics.length === 0 ? (
                    <tr>
                      <td colSpan={8} style={{ textAlign: "center" }}>
                        No analytics data available
                      </td>
                    </tr>
                  ) : (
                    analytics.map((a) => (
                      <tr key={a.id}>
                        <td>{a.id}</td>
                        <td>{a.customer}</td>
                        <td>{a.total_bookings}</td>
                        <td>₱{a.total_spent}</td>
                        <td>{new Date(a.last_booking).toLocaleString()}</td>
                        <td>{a.user_id}</td>
                        <td>{a.most_booked_service}</td>
                        <td>{new Date(a.created_at).toLocaleString()}</td>
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

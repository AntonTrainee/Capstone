import { useEffect, useMemo, useState } from "react";
import "../salesreq.css";

type ReportType = "sales" | "request";
type ServiceType =
  | "General Cleaning"
  | "Pest Control"
  | "Janitorial"
  | "Cleaning Services";

interface RecordItem {
  id: string;
  user_id?: string;
  service: string;
  payment?: number;
  status?: string;
  completed_at?: string;
  created_at?: string;
  booking_id?: string;
  address?: string;
  booking_date?: string;
}

interface AnalyticsItem {
  analytics_id: number;
  service: string;
  total_customers: number;
  total_amount: number;
}

interface Filters {
  reportType: ReportType;
  service?: ServiceType | "All";
  from?: string;
  to?: string;
  search?: string;
}

export default function SalesAndRequest() {
  const [filters, setFilters] = useState<Filters>({
    reportType: "sales",
    service: "All",
    search: "",
  });

  const [data, setData] = useState<RecordItem[]>([]);
  const [analytics, setAnalytics] = useState<AnalyticsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // ✅ Fetch sales or requests
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);

      const endpoint =
        filters.reportType === "sales"
          ? "http://localhost:3007/sales"
          : "http://localhost:3007/requests";

      try {
        const res = await fetch(endpoint);
        if (!res.ok)
          throw new Error(`Failed to fetch ${filters.reportType}: ${res.statusText}`);
        const rows = await res.json();

        const mapped: RecordItem[] =
          filters.reportType === "sales"
            ? rows.map((item: any) => ({
                id: item.sale_id ?? "N/A",
                user_id: item.user_id ?? "N/A",
                service: item.service ?? "N/A",
                payment: parseFloat(item.payment ?? 0),
                status: item.status ?? "N/A",
                completed_at: item.completed_at ?? "N/A",
                created_at: item.created_at ?? "N/A",
              }))
            : rows.map((item: any) => ({
                id: item.request_id ?? "N/A",
                booking_id: item.booking_id ?? "N/A",
                user_id: item.user_id ?? "N/A",
                service: item.service ?? "N/A",
                address: item.address ?? "N/A",
                status: item.status ?? "N/A",
                created_at: item.created_at ?? "N/A",
                booking_date: item.booking_date ?? "N/A",
              }));

        setData(mapped);
      } catch (err: any) {
        console.error(`❌ Error fetching ${filters.reportType}:`, err);
        setError(err.message);
        setData([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [filters.reportType]);

  // ✅ Fetch analytics (sales summary)
  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const res = await fetch("http://localhost:3007/analytics");
        if (!res.ok) throw new Error(`Failed to fetch analytics: ${res.statusText}`);
        const rows = await res.json();
        setAnalytics(rows);
      } catch (err: any) {
        console.error("❌ Error fetching analytics:", err);
      }
    };
    fetchAnalytics();
  }, []);

  // ✅ Filters
  const filteredRows = useMemo(() => {
    return data.filter((r) => {
      if (filters.service && filters.service !== "All" && r.service !== filters.service)
        return false;
      if (filters.from && new Date(r.created_at ?? "") < new Date(filters.from))
        return false;
      if (filters.to && new Date(r.created_at ?? "") > new Date(filters.to))
        return false;
      if (
        filters.search &&
        !r.service.toLowerCase().includes(filters.search.toLowerCase())
      )
        return false;
      return true;
    });
  }, [data, filters]);

  // ✅ CSV Download
  const handleDownload = () => {
    if (filteredRows.length === 0) return alert("No data to download");

    const headers =
      filters.reportType === "sales"
        ? ["Sale ID", "User ID", "Service", "Payment", "Status", "Completed At", "Created At"]
        : [
            "Request ID",
            "Booking ID",
            "User ID",
            "Service",
            "Address",
            "Status",
            "Created At",
            "Booking Date",
          ];

    const csvContent = [
      headers.join(","),
      ...filteredRows.map((r) =>
        filters.reportType === "sales"
          ? [
              r.id,
              r.user_id,
              r.service,
              r.payment,
              r.status,
              r.completed_at,
              r.created_at,
            ].join(",")
          : [
              r.id,
              r.booking_id,
              r.user_id,
              r.service,
              r.address,
              r.status,
              r.created_at,
              r.booking_date,
            ].join(",")
      ),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.setAttribute("download", `${filters.reportType}_full_report.csv`);
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div className="app-container">
      <header className="app-header">
        <div className="header-inner">
          <div className="logo">
            <span className="logo-main">GenClean</span>
            <span className="logo-sub">Sales & Request</span>
          </div>
        </div>
      </header>

      <main className="app-main">
        <section className="analytics-hero">
          <div>
            <h1>Sales and Request Reports</h1>
            <p>Switch between reports using the options below.</p>
            {error && <p style={{ color: "red" }}>Error: {error}</p>}
          </div>

          <div className="filter-controls">
            <select
              value={filters.service}
              onChange={(e) =>
                setFilters({ ...filters, service: e.target.value as Filters["service"] })
              }
            >
              <option value="All">All Services</option>
              <option value="General Cleaning">General Cleaning</option>
              <option value="Cleaning Services">Cleaning Services</option>
              <option value="Pest Control">Pest Control</option>
              <option value="Janitorial">Janitorial</option>
            </select>
          </div>
        </section>

        {/* Filter Controls */}
        <div className="metrics-grid">
          <div className="metric-card">
            <label>From</label>
            <input
              type="date"
              value={filters.from ?? ""}
              onChange={(e) =>
                setFilters({ ...filters, from: e.target.value || undefined })
              }
            />
          </div>
          <div className="metric-card">
            <label>To</label>
            <input
              type="date"
              value={filters.to ?? ""}
              onChange={(e) =>
                setFilters({ ...filters, to: e.target.value || undefined })
              }
            />
          </div>
          <div className="metric-card">
            <label>Report Type</label>
            <div className="radio-group">
              <label>
                <input
                  type="radio"
                  name="reportType"
                  value="sales"
                  checked={filters.reportType === "sales"}
                  onChange={() => setFilters({ ...filters, reportType: "sales" })}
                />
                Sales
              </label>
              <label>
                <input
                  type="radio"
                  name="reportType"
                  value="request"
                  checked={filters.reportType === "request"}
                  onChange={() => setFilters({ ...filters, reportType: "request" })}
                />
                Requests
              </label>
            </div>
          </div>
          <div className="metric-card">
            <label>Search</label>
            <input
              type="text"
              placeholder="Search by service..."
              value={filters.search ?? ""}
              onChange={(e) =>
                setFilters({ ...filters, search: e.target.value })
              }
            />
          </div>
        </div>

        {/* Table */}
        <section>
          <div className="table-header">
            <h2>
              {filters.reportType === "sales"
                ? "Sales Report (All Columns)"
                : "Requests Report (All Columns)"}
            </h2>
            <button className="download-btn" onClick={handleDownload}>
              ⬇ Download Report
            </button>
          </div>

          {loading ? (
            <p>Loading...</p>
          ) : (
            <div className="table-wrapper">
              <table className="salesreq-table">
                <thead>
                  {filters.reportType === "sales" ? (
                    <tr>
                      <th>Sale ID</th>
                      <th>User ID</th>
                      <th>Service</th>
                      <th>Payment</th>
                      <th>Status</th>
                      <th>Completed At</th>
                      <th>Created At</th>
                    </tr>
                  ) : (
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
                  )}
                </thead>

                <tbody>
                  {filteredRows.length === 0 ? (
                    <tr>
                      <td colSpan={8} style={{ textAlign: "center" }}>
                        No records found
                      </td>
                    </tr>
                  ) : filters.reportType === "sales" ? (
                    filteredRows.map((r) => (
                      <tr key={r.id}>
                        <td>{r.id}</td>
                        <td>{r.user_id}</td>
                        <td>{r.service}</td>
                        <td>₱{r.payment?.toFixed(2)}</td>
                        <td>{r.status}</td>
                        <td>{r.completed_at}</td>
                        <td>{r.created_at}</td>
                      </tr>
                    ))
                  ) : (
                    filteredRows.map((r) => (
                      <tr key={r.id}>
                        <td>{r.id}</td>
                        <td>{r.booking_id}</td>
                        <td>{r.user_id}</td>
                        <td>{r.service}</td>
                        <td>{r.address}</td>
                        <td>{r.status}</td>
                        <td>{r.created_at}</td>
                        <td>{r.booking_date}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}

          {/* ✅ Analytics Section */}
          <section style={{ marginTop: "2rem" }}>
            <h2>Customer Analytics</h2>
            {analytics.length === 0 ? (
              <p>No analytics data found</p>
            ) : (
              <table className="salesreq-table">
                <thead>
                  <tr>
                    <th>Service</th>
                    <th>Total Customers</th>
                    <th>Total Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {analytics.map((a) => (
                    <tr key={a.analytics_id}>
                      <td>{a.service}</td>
                      <td>{a.total_customers}</td>
                      <td>₱{a.total_amount.toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </section>
        </section>
      </main>

      <footer className="app-footer">© {new Date().getFullYear()} GenClean</footer>
    </div>
  );
}

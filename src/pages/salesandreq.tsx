import { useEffect, useMemo, useState, useCallback } from "react";
import { io } from "socket.io-client";
import "../salesreq.css";

type ReportType = "sales" | "request";
type ServiceType =
  | "General Maintenance"
  | "Janitorial and Cleaning Services"
  | "Pest Control";

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

interface Filters {
  reportType: ReportType;
  service?: ServiceType | "All";
  from?: string;
  to?: string;
  search?: string;
}

interface SaleApiResponse {
  sale_id: string;
  user_id: string;
  service: string;
  payment: string;
  status: string;
  completed_at: string;
  created_at: string;
}

interface RequestApiResponse {
  booking_id: string;
  user_id: string;
  service: string;
  address: string;
  status: string;
  created_at: string;
  booking_date: string;
}

export default function SalesAndRequest() {
  const [filters, setFilters] = useState<Filters>({
    reportType: "sales",
    service: "All",
    search: "",
  });
  const [data, setData] = useState<RecordItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // ✅ Wrapped in useCallback to fix ESLint dependency warning
  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);

    const endpoint =
      filters.reportType === "sales"
        ? "https://capstone-ni5z.onrender.com/sales"
        : "https://capstone-ni5z.onrender.com/requests";

    try {
      const res = await fetch(endpoint);
      if (!res.ok) throw new Error(`Failed to fetch ${filters.reportType}`);

      const rows: SaleApiResponse[] | RequestApiResponse[] = await res.json();

      const mapped: RecordItem[] =
        filters.reportType === "sales"
          ? (rows as SaleApiResponse[]).map((item) => ({
              id: item.sale_id,
              user_id: item.user_id,
              service: item.service,
              payment: parseFloat(item.payment ?? "0"),
              status: item.status,
              completed_at: item.completed_at,
              created_at: item.created_at,
            }))
          : (rows as RequestApiResponse[]).map((item) => ({
              id: item.booking_id,
              booking_id: item.booking_id,
              user_id: item.user_id,
              service: item.service,
              address: item.address,
              status: item.status,
              created_at: item.created_at,
              booking_date: item.booking_date,
            }));

      setData(mapped);
    } catch (err) {
      console.error(`Error fetching ${filters.reportType}:`, err);
      setError(err instanceof Error ? err.message : "Unknown error");
      setData([]);
    } finally {
      setLoading(false);
    }
  }, [filters.reportType]); // ✅ dependency is only reportType

  // Fetch data when reportType changes
  useEffect(() => {
    fetchData();
  }, [fetchData]); // ✅ ESLint-safe

  // Real-time updates via Socket.IO
  useEffect(() => {
    const socket = io("https://capstone-ni5z.onrender.com");

    socket.on("connect", () =>
      console.log("Connected to Socket.IO in SalesAndRequest")
    );

    socket.on("updateSales", () => {
      if (filters.reportType === "sales") fetchData();
    });

    socket.on("updateRequests", () => {
      if (filters.reportType === "request") fetchData();
    });

    socket.on("disconnect", () =>
      console.log("Disconnected from Socket.IO in SalesAndRequest")
    );

    return () => {
      socket.disconnect();
    };
  }, [filters.reportType, fetchData]); // ✅ includes fetchData

  const filteredRows = useMemo(() => {
    return data.filter((r) => {
      const serviceMatch =
        filters.service === "All" ||
        r.service?.toLowerCase() === filters.service?.toLowerCase();

      const fromMatch =
        !filters.from || new Date(r.created_at ?? "") >= new Date(filters.from);

      const toMatch =
        !filters.to || new Date(r.created_at ?? "") <= new Date(filters.to);

      const searchMatch =
        !filters.search ||
        r.service?.toLowerCase().includes(filters.search.toLowerCase());

      return serviceMatch && fromMatch && toMatch && searchMatch;
    });
  }, [data, filters]);

  const handleDownload = () => {
    if (filteredRows.length === 0) return alert("No data to download");

    const headers =
      filters.reportType === "sales"
        ? [
            "Sale ID",
            "User ID",
            "Service",
            "Payment",
            "Status",
            "Completed At",
            "Created At",
          ]
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
    a.setAttribute("download", `${filters.reportType}_report.csv`);
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
            <span className="logo-sub">Sales & Requests</span>
          </div>
        </div>
      </header>

      <main className="app-main">
        <section className="analytics-hero">
          <div>
            <h1>Sales and Request Reports</h1>
            <p>Filter and download complete records easily.</p>
            {error && <p className="error-text">Error: {error}</p>}
          </div>

          <div className="filter-controls">
            <select
              value={filters.service}
              onChange={(e) =>
                setFilters({
                  ...filters,
                  service: e.target.value as Filters["service"],
                })
              }
            >
              <option value="All">All Services</option>
              <option value="General Maintenance">General Maintenance</option>
              <option value="Janitorial and Cleaning Services">
                Janitorial and Cleaning Services
              </option>
              <option value="Pest Control">Pest Control</option>
            </select>
          </div>
        </section>

        {/* Filters */}
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
                  onChange={() =>
                    setFilters({ ...filters, reportType: "sales" })
                  }
                />
                Sales
              </label>
              <label>
                <input
                  type="radio"
                  name="reportType"
                  value="request"
                  checked={filters.reportType === "request"}
                  onChange={() =>
                    setFilters({ ...filters, reportType: "request" })
                  }
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
                ? "Sales Report"
                : "Requests Report"}
            </h2>
            <button className="download-btn" onClick={handleDownload}>
              Download Report
            </button>
          </div>

          {loading ? (
            <p>Loading data...</p>
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
                        <td>
                          ₱
                          {r.payment
                            ? r.payment.toLocaleString("en-PH", {
                                minimumFractionDigits: 2,
                              })
                            : "0.00"}
                        </td>
                        <td>{r.status}</td>
                        <td>
                          {r.completed_at
                            ? new Date(r.completed_at).toLocaleString("en-PH")
                            : "N/A"}
                        </td>
                        <td>
                          {r.created_at
                            ? new Date(r.created_at).toLocaleString("en-PH")
                            : "N/A"}
                        </td>
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
                        <td>
                          {r.created_at
                            ? new Date(r.created_at).toLocaleString("en-PH")
                            : "N/A"}
                        </td>
                        <td>
                          {r.booking_date
                            ? new Date(r.booking_date).toLocaleString("en-PH")
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

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
  customer: string;
  service: ServiceType;
  date: string;
  type: ReportType;
  notes?: string;
  total: number;
}

interface Filters {
  from?: string;
  to?: string;
  service?: ServiceType | "All";
  reportType: ReportType;
  search?: string;
}

export default function SalesAndRequest() {
  const [filters, setFilters] = useState<Filters>({
    reportType: "sales",
    service: "All",
    search: "",
  });
  const [data, setData] = useState<RecordItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const res = await fetch("http://localhost:3007/sales");
        const rows = await res.json();

        const mapped: RecordItem[] = (rows || []).map((item: any) => ({
          id: String(item.id),
          customer: item.customer,
          service: item.service,
          date: item.created_at || item.createdat,
          type: item.status === "sales" ? "sales" : "request",
          notes: item.notes ?? "",
          total: Number(item.amount) || 0,
        }));

        setData(mapped);
      } catch (err) {
        console.error("❌ Error fetching sales_request:", err);
      }
      setLoading(false);
    };

    fetchData();
  }, []);

  function filterRows(rows: RecordItem[], filters: Filters) {
    return rows.filter((r) => {
      if (filters.reportType && r.type !== filters.reportType) return false;
      if (filters.service && filters.service !== "All" && r.service !== filters.service) return false;
      if (filters.from && new Date(r.date) < new Date(filters.from)) return false;
      if (filters.to && new Date(r.date) > new Date(filters.to)) return false;
      if (filters.search && !r.customer.toLowerCase().includes(filters.search.toLowerCase())) return false;
      return true;
    });
  }

  const rows = useMemo(() => filterRows(data, filters), [data, filters]);

  // === Download Function ===
  function handleDownload() {
    if (rows.length === 0) {
      alert("No data to download");
      return;
    }

    const header = ["Customer", "Service", "Date", "Notes", "Total"];
    const csvContent = [
      header.join(","),
      ...rows.map((r) =>
        [
          `"${r.customer}"`,
          `"${r.service}"`,
          `"${new Date(r.date).toLocaleDateString()}"`,
          `"${r.notes ?? ""}"`,
          `"₱${r.total.toFixed(2)}"`,
        ].join(",")
      ),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.setAttribute("download", "report.csv");
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }

  return (
    <div className="app-container">
      {/* Header */}
      <header className="app-header">
        <div className="header-inner">
          <div className="logo">
            <span className="logo-main">GenClean</span>
            <span className="logo-sub">Sales & Request</span>
          </div>
        </div>
      </header>

      <main className="app-main">
        {/* Filters Banner */}
        <section className="analytics-hero">
          <div>
            <h1>Sales and Request Reports</h1>
            <p>Filter and track customer requests and completed sales.</p>
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

        {/* Advanced Filters */}
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
                Request
              </label>
            </div>
          </div>
          <div className="metric-card">
            <label>Search Customer</label>
            <input
              type="text"
              placeholder="Search by customer name"
              value={filters.search ?? ""}
              onChange={(e) =>
                setFilters({ ...filters, search: e.target.value })
              }
            />
          </div>
        </div>

        {/* Table Section */}
        <section>
          <div className="table-header">
            <h2>Report Preview</h2>
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
                  <tr>
                    <th>Customer</th>
                    <th>Service</th>
                    <th>Date</th>
                    <th>Notes</th>
                    <th className="text-right">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.length === 0 ? (
                    <tr>
                      <td colSpan={5} style={{ textAlign: "center" }}>
                        No records available
                      </td>
                    </tr>
                  ) : (
                    rows.map((r) => (
                      <tr key={r.id}>
                        <td className="capitalize">{r.customer}</td>
                        <td>{r.service}</td>
                        <td>{new Date(r.date).toLocaleDateString()}</td>
                        <td>{r.notes ?? ""}</td>
                        <td className="text-right">₱{r.total.toFixed(2)}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </main>

      <footer className="app-footer">© {new Date().getFullYear()} GenClean</footer>
    </div>
  );
}

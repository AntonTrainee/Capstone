import { useEffect, useState } from "react";
import "./manageb.css";

interface Booking {
  id: string;
  user_id: string;
  service: string;
  booking_date: string;
  address: string;
  notes?: string;
  for_assessment: boolean;
  created_at?: string;
}

export default function ManageBookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [editing, setEditing] = useState<string | null>(null);
  const [formData, setFormData] = useState<Partial<Booking>>({});
  const [search, setSearch] = useState("");
  const [viewing, setViewing] = useState<Booking | null>(null);

  useEffect(() => {
    fetch("http://localhost:3007/bookings")
      .then((res) => res.json())
      .then((data) => setBookings(data))
      .catch((err) => console.error("Error fetching bookings:", err));
  }, []);

  const startEdit = (booking: Booking) => {
    setEditing(booking.id);
    setFormData(booking);
  };

  const saveEdit = async () => {
    if (!editing) return;
    if (!window.confirm("Are you sure you want to save changes?")) return;

    try {
      const res = await fetch(`http://localhost:3007/bookings/${editing}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        const updated = await res.json();
        setBookings((prev) =>
          prev.map((b) => (b.id === editing ? updated : b))
        );
        setEditing(null);
        setFormData({});
        alert("✅ Booking updated successfully!");
      } else {
        alert(`❌ Failed to update booking.`);
      }
    } catch (err: any) {
      console.error("Error updating booking:", err);
    }
  };

  const filtered = bookings.filter((b) =>
    [b.id, b.user_id, b.service, b.address].some((v) =>
      v?.toLowerCase().includes(search.toLowerCase())
    )
  );

  return (
    <div className="app-container">
      {/* Header identical to analytics */}
      <header className="app-header">
        <div className="header-inner">
          <div className="logo">
            <span className="logo-main">GenClean</span>
            <span className="logo-sub">Manage Bookings</span>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="app-main">
        <section className="analytics-hero">
          <div>
            <h1>Manage Bookings</h1>
            <p>View, edit, and manage all booking requests.</p>
          </div>
          <div className="filter-controls">
            <input
              type="text"
              placeholder="🔍 Search bookings..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="search-input"
            />
          </div>
        </section>

        <section>
          <h2>Bookings Table</h2>
          <div className="table-wrapper">
            <table className="analytics-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>User ID</th>
                  <th>Service</th>
                  <th>Booking Date</th>
                  <th>Address</th>
                  <th>Notes</th>
                  <th>Assessment</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={8} style={{ textAlign: "center" }}>
                      No bookings found
                    </td>
                  </tr>
                ) : (
                  filtered.map((b) => (
                    <tr key={b.id}>
                      <td>{b.id}</td>
                      <td>{b.user_id}</td>
                      <td>
                        {editing === b.id ? (
                          <input
                            value={formData.service || ""}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                service: e.target.value,
                              })
                            }
                          />
                        ) : (
                          b.service
                        )}
                      </td>
                      <td>
                        {editing === b.id ? (
                          <input
                            type="date"
                            value={formData.booking_date?.slice(0, 10) || ""}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                booking_date: e.target.value,
                              })
                            }
                          />
                        ) : (
                          new Date(b.booking_date).toLocaleDateString()
                        )}
                      </td>
                      <td>
                        {editing === b.id ? (
                          <input
                            value={formData.address || ""}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                address: e.target.value,
                              })
                            }
                          />
                        ) : (
                          b.address
                        )}
                      </td>
                      <td>
                        {editing === b.id ? (
                          <input
                            value={formData.notes || ""}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                notes: e.target.value,
                              })
                            }
                          />
                        ) : (
                          b.notes || "—"
                        )}
                      </td>
                      <td>{b.for_assessment ? "✅ Yes" : "❌ No"}</td>
                      <td className="actions">
                        {editing === b.id ? (
                          <>
                            <button onClick={saveEdit} className="btn btn--save">
                              💾 Save
                            </button>
                            <button
                              onClick={() => setEditing(null)}
                              className="btn btn--cancel"
                            >
                              ✖ Cancel
                            </button>
                          </>
                        ) : (
                          <>
                            <button
                              onClick={() => startEdit(b)}
                              className="btn btn--edit"
                            >
                              ✏ Edit
                            </button>
                            <button
                              onClick={() => setViewing(b)}
                              className="btn btn--view"
                            >
                              👁 View
                            </button>
                          </>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </section>

        {/* Details card (keep floating) */}
        {viewing && (
          <div className="card details-card">
            <h2>Booking Details</h2>
            <p><strong>ID:</strong> {viewing.id}</p>
            <p><strong>User ID:</strong> {viewing.user_id}</p>
            <p><strong>Service:</strong> {viewing.service}</p>
            <p><strong>Date:</strong> {new Date(viewing.booking_date).toLocaleString()}</p>
            <p><strong>Address:</strong> {viewing.address}</p>
            <p><strong>Notes:</strong> {viewing.notes || "—"}</p>
            <p><strong>Assessment:</strong> {viewing.for_assessment ? "Yes" : "No"}</p>
            <p><strong>Created At:</strong> {viewing.created_at ? new Date(viewing.created_at).toLocaleString() : "N/A"}</p>
            <button onClick={() => setViewing(null)} className="btn btn--close">
              Close
            </button>
          </div>
        )}
      </main>

      {/* Footer identical to analytics */}
      <footer className="app-footer">
        © {new Date().getFullYear()} GenClean
      </footer>
    </div>
  );
}

import { useEffect, useState } from "react";
import "./manageb.css";

interface Booking {
  booking_id: string;
  user_id: string;
  service: string;
  booking_date: string;
  address: string;
  notes?: string;
  for_assessment: boolean;
  created_at?: string;
  name?: string;
  payment?: string | null;
  status?: string;
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
    setEditing(booking.booking_id);
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
          prev.map((b) => (b.booking_id === editing ? updated : b))
        );
        setEditing(null);
        setFormData({});
        alert("✅ Booking updated successfully!");
      } else {
        alert("❌ Failed to update booking.");
      }
    } catch (err: any) {
      console.error("Error updating booking:", err);
    }
  };

  const filtered = bookings.filter((b) =>
    [b.booking_id, b.user_id, b.service, b.address, b.name, b.status].some((v) =>
      v?.toLowerCase().includes(search.toLowerCase())
    )
  );

  return (
    <div className="app-container">
      <header className="app-header">
        <div className="header-inner">
          <div className="logo">
            <span className="logo-main">GenClean</span>
            <span className="logo-sub">Manage Bookings</span>
          </div>
        </div>
      </header>

      <main className="app-main">
        <section className="analytics-hero">
          <div>
            <h1>Manage Bookings</h1>
            <p>View, edit, and manage all booking records.</p>
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
                  <th>Booking ID</th>
                  <th>User ID</th>
                  <th>Name</th>
                  <th>Service</th>
                  <th>Booking Date</th>
                  <th>Address</th>
                  <th>Notes</th>
                  <th>For Assessment</th>
                  <th>Created At</th>
                  <th>Payment</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={12} style={{ textAlign: "center" }}>
                      No bookings found
                    </td>
                  </tr>
                ) : (
                  filtered.map((b) => (
                    <tr key={b.booking_id}>
                      <td>{b.booking_id}</td>
                      <td>{b.user_id}</td>
                      <td>{b.name || "—"}</td>

                      <td>
                        {editing === b.booking_id ? (
                          <input
                            className="wide-input"
                            value={formData.service || ""}
                            onChange={(e) =>
                              setFormData({ ...formData, service: e.target.value })
                            }
                          />
                        ) : (
                          b.service
                        )}
                      </td>

                      <td>
                        {editing === b.booking_id ? (
                          <input
                            type="date"
                            className="wide-input"
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
                        {editing === b.booking_id ? (
                          <input
                            className="wide-input"
                            value={formData.address || ""}
                            onChange={(e) =>
                              setFormData({ ...formData, address: e.target.value })
                            }
                          />
                        ) : (
                          b.address
                        )}
                      </td>

                      <td>
                        {editing === b.booking_id ? (
                          <textarea
                            className="textarea-expand"
                            rows={3}
                            value={formData.notes || ""}
                            onChange={(e) =>
                              setFormData({ ...formData, notes: e.target.value })
                            }
                          />
                        ) : (
                          b.notes || "—"
                        )}
                      </td>

                      <td>{b.for_assessment ? "✅ Yes" : "❌ No"}</td>

                      <td>
                        {b.created_at
                          ? new Date(b.created_at).toLocaleString()
                          : "—"}
                      </td>

                      <td>
                        {editing === b.booking_id ? (
                          <input
                            type="number"
                            className="payment-input"
                            placeholder="Enter amount"
                            value={formData.payment || ""}
                            onChange={(e) =>
                              setFormData({ ...formData, payment: e.target.value })
                            }
                          />
                        ) : b.payment ? (
                          `₱${b.payment}`
                        ) : (
                          "—"
                        )}
                      </td>

                      {/* UPDATED STATUS COLUMN */}
                      <td>
                        {editing === b.booking_id ? (
                          <select
                            className="wide-input"
                            value={formData.status || "pending"}
                            onChange={(e) =>
                              setFormData({ ...formData, status: e.target.value })
                            }
                          >
                            <option value="pending">pending</option>
                            <option value="completed">completed</option>
                          </select>
                        ) : (
                          b.status || "—"
                        )}
                      </td>

                      <td className="actions">
                        {editing === b.booking_id ? (
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

        {viewing && (
          <div className="card details-card">
            <h2>Booking Details</h2>
            <p>
              <strong>Booking ID:</strong> {viewing.booking_id}
            </p>
            <p>
              <strong>User ID:</strong> {viewing.user_id}
            </p>
            <p>
              <strong>Name:</strong> {viewing.name || "—"}
            </p>
            <p>
              <strong>Service:</strong> {viewing.service}
            </p>
            <p>
              <strong>Date:</strong>{" "}
              {new Date(viewing.booking_date).toLocaleString()}
            </p>
            <p>
              <strong>Address:</strong> {viewing.address}
            </p>
            <p>
              <strong>Notes:</strong> {viewing.notes || "—"}
            </p>
            <p>
              <strong>Assessment:</strong>{" "}
              {viewing.for_assessment ? "Yes" : "No"}
            </p>
            <p>
              <strong>Created At:</strong>{" "}
              {viewing.created_at
                ? new Date(viewing.created_at).toLocaleString()
                : "N/A"}
            </p>
            <p>
              <strong>Payment:</strong>{" "}
              {viewing.payment ? `₱${viewing.payment}` : "Not Set"}
            </p>
            <p>
              <strong>Status:</strong> {viewing.status || "pending"}
            </p>
            <button onClick={() => setViewing(null)} className="btn btn--close">
              Close
            </button>
          </div>
        )}
      </main>

      <footer className="app-footer">
        © {new Date().getFullYear()} GenClean
      </footer>
    </div>
  );
}
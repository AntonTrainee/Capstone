import { useEffect, useState } from "react";
import "./manageb.css";

interface Booking {
  booking_id: string;
  user_id: string;
  service: string;
  booking_date: string; // ISO datetime
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

  // Fetch all bookings
  useEffect(() => {
    fetch("https://capstone-ni5z.onrender.com/bookings")
      .then((res) => res.json())
      .then((data) => setBookings(data))
      .catch((err) => console.error("Error fetching bookings:", err));
  }, []);

  const startEdit = (booking: Booking) => {
    if (booking.status === "completed") return;
    setEditing(booking.booking_id);
    setFormData(booking);
  };

  const saveEdit = async () => {
    if (!editing) return;
    if (!window.confirm("Are you sure you want to save changes?")) return;

    try {
      const res = await fetch(`https://capstone-ni5z.onrender.com/bookings/${editing}`, {
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

  const markAsCompleted = async (booking_id: string) => {
    if (!window.confirm("Are you sure the cleaning is done?")) return;

    try {
      const bookingToUpdate = bookings.find((b) => b.booking_id === booking_id);
      if (!bookingToUpdate) return;

      const updatedData = { ...bookingToUpdate, status: "completed" };

      const res = await fetch(`https://capstone-ni5z.onrender.com/bookings/${booking_id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedData),
      });

      if (res.ok) {
        const updatedBooking = await res.json();
        setBookings((prev) =>
          prev.map((b) => (b.booking_id === booking_id ? updatedBooking : b))
        );
        alert("✅ Booking marked as completed!");
      } else {
        alert("❌ Failed to complete booking.");
      }
    } catch (err) {
      console.error("Error completing booking:", err);
    }
  };

  const filtered = bookings.filter((b) =>
    [b.booking_id, b.user_id, b.service, b.address, b.name, b.status].some(
      (v) => v?.toLowerCase().includes(search.toLowerCase())
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
                  <th>ID</th>
                  <th>User ID</th>
                  <th>Name</th>
                  <th>Service</th>
                  <th>Date & Time</th>
                  <th>Address</th>
                  <th>Notes</th>
                  <th>Assessment</th>
                  <th>Payment</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={11} style={{ textAlign: "center" }}>
                      No bookings found
                    </td>
                  </tr>
                ) : (
                  filtered.map((b) => (
                    <tr key={b.booking_id}>
                      <td>{b.booking_id}</td>
                      <td>{b.user_id}</td>
                      <td>
                        {editing === b.booking_id ? (
                          <input
                            value={formData.name || ""}
                            onChange={(e) =>
                              setFormData({ ...formData, name: e.target.value })
                            }
                          />
                        ) : (
                          b.name || "—"
                        )}
                      </td>

                      <td>
                        {editing === b.booking_id ? (
                          <input
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
                          <>
                            <input
                              type="date"
                              value={formData.booking_date?.slice(0, 10) || ""}
                              onChange={(e) =>
                                setFormData({
                                  ...formData,
                                  booking_date: e.target.value + 
                                    (formData.booking_date?.slice(10) || "T00:00"),
                                })
                              }
                            />
                            <input
                              type="time"
                              value={
                                formData.booking_date
                                  ? formData.booking_date.slice(11, 16)
                                  : "00:00"
                              }
                              onChange={(e) =>
                                setFormData({
                                  ...formData,
                                  booking_date:
                                    (formData.booking_date?.slice(0, 10) || "1970-01-01") +
                                    "T" +
                                    e.target.value,
                                })
                              }
                            />
                          </>
                        ) : (
                          new Date(b.booking_date).toLocaleString()
                        )}
                      </td>

                      <td>
                        {editing === b.booking_id ? (
                          <input
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
                            rows={2}
                            value={formData.notes || ""}
                            onChange={(e) =>
                              setFormData({ ...formData, notes: e.target.value })
                            }
                          />
                        ) : (
                          b.notes || "—"
                        )}
                      </td>

                      <td>{b.for_assessment ? "✅" : "❌"}</td>

                      <td>
                        {editing === b.booking_id ? (
                          <input
                            type="number"
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

                      <td>
                        {b.status === "completed"
                          ? "completed ✅"
                          : "pending ⏳"}
                      </td>

                      <td className="actions">
                        {b.status === "pending" ? (
                          editing === b.booking_id ? (
                            <>
                              <button
                                onClick={saveEdit}
                                className="btn btn--save"
                              >
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
                                onClick={() => markAsCompleted(b.booking_id)}
                                className="btn btn--complete"
                              >
                                ✅ Complete
                              </button>
                            </>
                          )
                        ) : (
                          "—"
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </section>
      </main>

      <footer className="app-footer">
        © {new Date().getFullYear()} GenClean
      </footer>
    </div>
  );
}

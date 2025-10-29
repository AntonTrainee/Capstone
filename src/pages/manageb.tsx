import { useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";
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

interface IncomingRequest {
  request_id: string;
  user_id: string;
  name?: string;
  service: string;
  booking_date: string;
  address: string;
  notes?: string;
  for_assessment: boolean;
  created_at?: string;
  status?: string;
}

export default function ManageBookingsPage(): React.JSX.Element {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [incomingRequests, setIncomingRequests] = useState<IncomingRequest[]>([]);
  const [editing, setEditing] = useState<string | null>(null);
  const [formData, setFormData] = useState<Partial<Booking>>({});
  const [search, setSearch] = useState("");

  const SERVER_URL = "https://capstone-ni5z.onrender.com";

  // ---------------------------
  // 🟦 Fetch Data from API
  // ---------------------------
  const fetchBookings = async (): Promise<void> => {
    try {
      const res = await fetch(`${SERVER_URL}/bookings`);
      const data: Booking[] = await res.json();
      setBookings(data);
    } catch (err) {
      console.error("Error fetching bookings:", err);
    }
  };

  const fetchIncomingRequests = async (): Promise<void> => {
    try {
      const res = await fetch(`${SERVER_URL}/incoming-requests`);
      const data: IncomingRequest[] = await res.json();
      setIncomingRequests(data);
    } catch (err) {
      console.error("Error fetching incoming requests:", err);
    }
  };

  // ---------------------------
  // 🟩 SOCKET.IO REAL-TIME UPDATES
  // ---------------------------
  useEffect(() => {
    fetchBookings();
    fetchIncomingRequests();

    const socket: Socket = io(SERVER_URL, {
      transports: ["websocket"],
      reconnection: true,
    });

    socket.on("incoming_requests_update", () => {
      console.log("🔁 Incoming requests updated — refreshing data");
      fetchIncomingRequests();
    });

    socket.on("bookings_update", () => {
      console.log("🔁 Bookings updated — refreshing data");
      fetchBookings();
    });

    return (): void => {
      socket.disconnect();
    };
  }, []);

  // ---------------------------
  // 💰 Format Payment Input
  // ---------------------------
  const formatCurrency = (value: string): string => {
    const numericValue = value.replace(/[^\d]/g, "");
    if (!numericValue) return "";
    return "₱" + parseInt(numericValue).toLocaleString();
  };

  const handlePaymentChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const formatted = formatCurrency(e.target.value);
    setFormData((prev) => ({
      ...prev,
      payment: formatted,
    }));
  };

  // ---------------------------
  // 📥 Incoming Request Actions
  // ---------------------------
  const approveRequest = async (id: string): Promise<void> => {
    if (!window.confirm("Approve this request? It will move to bookings and notify the customer.")) return;

    try {
      const res = await fetch(`${SERVER_URL}/incoming-requests/approve/${id}`, { method: "POST" });

      if (res.ok) {
        setIncomingRequests((prev) => prev.filter((r) => r.request_id !== id));
        fetchBookings();
        alert("✅ Request approved and customer notified!");
      } else {
        alert("❌ Failed to approve request.");
      }
    } catch (err) {
      console.error("Error approving request:", err);
    }
  };

  const rejectRequest = async (id: string): Promise<void> => {
    const reason = prompt("Enter reason for rejection (optional):", "") || "No reason provided";
    if (!window.confirm("⚠️ Continue rejection? This cannot be undone.")) return;

    try {
      const res = await fetch(`${SERVER_URL}/incoming-requests/${id}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reason }),
      });

      if (res.ok) {
        setIncomingRequests((prev) => prev.filter((r) => r.request_id !== id));
        alert(`🚫 Request rejected and customer notified.\nReason: ${reason}`);
      } else {
        alert("❌ Failed to reject request.");
      }
    } catch (err) {
      console.error("Error rejecting request:", err);
    }
  };

  // ---------------------------
  // 📝 Booking Edit Actions
  // ---------------------------
  const startEdit = (booking: Booking): void => {
    if (booking.status === "completed") return;
    setEditing(booking.booking_id);
    setFormData(booking);
  };

  const saveEdit = async (): Promise<void> => {
    if (!editing) return;
    if (!window.confirm("Are you sure you want to save changes?")) return;

    try {
      // Clean numeric value before saving
      const cleanedData = {
        ...formData,
        payment: formData.payment
          ? Number(formData.payment.replace(/[^\d.]/g, ""))
          : null,
      };

      const res = await fetch(`${SERVER_URL}/bookings/${editing}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(cleanedData),
      });

      if (res.ok) {
        const updated: Booking = await res.json();
        setBookings((prev) =>
          prev.map((b) => (b.booking_id === editing ? updated : b))
        );
        setEditing(null);
        setFormData({});
        alert("✅ Booking updated successfully!");
      } else {
        alert("❌ Failed to update booking.");
      }
    } catch (err) {
      console.error("Error updating booking:", err);
    }
  };

  // ---------------------------
  // ✅ Mark as Completed
  // ---------------------------
  const markAsCompleted = async (booking_id: string): Promise<void> => {
    const bookingToUpdate = bookings.find((b) => b.booking_id === booking_id);
    if (!bookingToUpdate) return;

    if (
      !bookingToUpdate.payment ||
      bookingToUpdate.payment.trim() === "" ||
      bookingToUpdate.payment === "₱0"
    ) {
      alert("⚠️ Please enter a valid payment amount before marking as completed.");
      return;
    }

    if (!window.confirm("Are you sure the cleaning is done?")) return;

    try {
      const updatedData = {
        ...bookingToUpdate,
        status: "completed",
        payment: bookingToUpdate.payment
          ? Number(bookingToUpdate.payment.replace(/[^\d.]/g, ""))
          : null,
      };

      const res = await fetch(`${SERVER_URL}/bookings/${booking_id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedData),
      });

      if (res.ok) {
        const updatedBooking: Booking = await res.json();
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

  // ---------------------------
  // 🔍 Filter Search
  // ---------------------------
  const filtered = bookings.filter((b) =>
    [b.booking_id, b.user_id, b.service, b.address, b.name, b.status].some(
      (v) => v?.toLowerCase().includes(search.toLowerCase())
    )
  );

  // ---------------------------
  // 🧾 Render Page
  // ---------------------------
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

        {/* ================= INCOMING REQUESTS ================= */}
        <section>
          <h2>Incoming Requests</h2>
          <div className="table-wrapper">
            <table className="analytics-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>User ID</th>
                  <th>Name</th>
                  <th>Service</th>
                  <th>Date</th>
                  <th>Address</th>
                  <th>Assessment</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {incomingRequests.length === 0 ? (
                  <tr>
                    <td colSpan={9} style={{ textAlign: "center" }}>
                      No incoming requests
                    </td>
                  </tr>
                ) : (
                  incomingRequests.map((r) => (
                    <tr key={r.request_id}>
                      <td>{r.request_id}</td>
                      <td>{r.user_id}</td>
                      <td>{r.name || "—"}</td>
                      <td>{r.service}</td>
                      <td>{new Date(r.booking_date).toLocaleString()}</td>
                      <td>{r.address}</td>
                      <td>{r.for_assessment ? "✅" : "❌"}</td>
                      <td>{r.status || "pending"}</td>
                      <td>
                        <button onClick={() => approveRequest(r.request_id)} className="btn btn--approve">
                          ✅ Approve
                        </button>
                        <button onClick={() => rejectRequest(r.request_id)} className="btn btn--reject">
                          ❌ Reject
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </section>

        {/* ================= BOOKINGS TABLE ================= */}
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
                      <td>{b.name || "—"}</td>
                      <td>{b.service}</td>
                      <td>{new Date(b.booking_date).toLocaleString()}</td>
                      <td>{b.address}</td>
                      <td>{b.notes || "—"}</td>
                      <td>{b.for_assessment ? "✅" : "❌"}</td>
                      <td>
                        {editing === b.booking_id ? (
                          <input
                            type="text"
                            value={formData.payment || ""}
                            onChange={handlePaymentChange}
                            placeholder="₱0.00"
                          />
                        ) : b.payment ? (
                          `₱${Number(b.payment).toLocaleString()}`
                        ) : (
                          "—"
                        )}
                      </td>
                      <td>{b.status === "completed" ? "✅ Completed" : "⏳ Pending"}</td>
                      <td className="actions">
                        {b.status === "pending" ? (
                          editing === b.booking_id ? (
                            <>
                              <button onClick={saveEdit} className="btn btn--save">
                                💾 Save
                              </button>
                              <button onClick={() => setEditing(null)} className="btn btn--cancel">
                                ✖ Cancel
                              </button>
                            </>
                          ) : (
                            <>
                              <button onClick={() => startEdit(b)} className="btn btn--edit">
                                ✏ Edit
                              </button>
                              <button onClick={() => markAsCompleted(b.booking_id)} className="btn btn--complete">
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

      <footer className="app-footer">© {new Date().getFullYear()} GenClean</footer>
    </div>
  );
}

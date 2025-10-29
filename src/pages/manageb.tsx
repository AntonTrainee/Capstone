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
  const [search, setSearch] = useState("");

  const [showCompleteModal, setShowCompleteModal] = useState(false);
  const [completingBookingId, setCompletingBookingId] = useState<string | null>(null);
  const [modalPayment, setModalPayment] = useState("");

  const [showApproveModal, setShowApproveModal] = useState(false);
  const [approvingRequestId, setApprovingRequestId] = useState<string | null>(null);

  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectingRequestId, setRejectingRequestId] = useState<string | null>(null);
  const [rejectReason, setRejectReason] = useState("");

  const SERVER_URL = "https://capstone-ni5z.onrender.com";

  // Fetch Bookings
  const fetchBookings = async (): Promise<void> => {
    try {
      const res = await fetch(`${SERVER_URL}/bookings`);
      const data: Booking[] = await res.json();
      setBookings(data);
    } catch (err) {
      console.error("Error fetching bookings:", err);
    }
  };

  // Fetch Incoming Requests
  const fetchIncomingRequests = async (): Promise<void> => {
    try {
      const res = await fetch(`${SERVER_URL}/incoming-requests`);
      const data: IncomingRequest[] = await res.json();
      setIncomingRequests(data);
    } catch (err) {
      console.error("Error fetching incoming requests:", err);
    }
  };

  // Real-time updates
  useEffect(() => {
    fetchBookings();
    fetchIncomingRequests();

    const socket: Socket = io(SERVER_URL, {
      transports: ["websocket"],
      reconnection: true,
    });

    socket.on("incoming_requests_update", fetchIncomingRequests);
    socket.on("bookings_update", fetchBookings);

    return (): void => {
      socket.disconnect();
    };
  }, []);

  // Format currency
  const formatCurrency = (value: string): string => {
    const numericValue = value.replace(/[^\d]/g, "");
    if (!numericValue) return "";
    return "₱" + parseInt(numericValue).toLocaleString();
  };

  const handleModalPaymentChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const formatted = formatCurrency(e.target.value);
    setModalPayment(formatted);
  };

  // Approve / Reject Logic
  const openApproveModal = (id: string): void => {
    setApprovingRequestId(id);
    setShowApproveModal(true);
  };

  const openRejectModal = (id: string): void => {
    setRejectingRequestId(id);
    setRejectReason("");
    setShowRejectModal(true);
  };

  const closeApproveModal = (): void => {
    setApprovingRequestId(null);
    setShowApproveModal(false);
  };

  const closeRejectModal = (): void => {
    setRejectingRequestId(null);
    setShowRejectModal(false);
  };

  const confirmApprove = async (): Promise<void> => {
    if (!approvingRequestId) return;
    try {
      const res = await fetch(`${SERVER_URL}/incoming-requests/approve/${approvingRequestId}`, {
        method: "POST",
      });
      if (res.ok) {
        setIncomingRequests((prev) => prev.filter((r) => r.request_id !== approvingRequestId));
        fetchBookings();
        closeApproveModal();
        alert("Request approved and customer notified!");
      } else {
        alert("Failed to approve request.");
      }
    } catch (err) {
      console.error("Error approving request:", err);
    }
  };

  const confirmReject = async (): Promise<void> => {
    if (!rejectingRequestId) return;
    const reason = rejectReason.trim() || "No reason provided";
    try {
      const res = await fetch(`${SERVER_URL}/incoming-requests/${rejectingRequestId}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reason }),
      });

      if (res.ok) {
        setIncomingRequests((prev) => prev.filter((r) => r.request_id !== rejectingRequestId));
        closeRejectModal();
        alert(`Request rejected and customer notified.\nReason: ${reason}`);
      } else {
        alert("Failed to reject request.");
      }
    } catch (err) {
      console.error("Error rejecting request:", err);
    }
  };

  // Completion Logic
  const openCompleteModal = (booking_id: string): void => {
    const booking = bookings.find((b) => b.booking_id === booking_id);
    if (!booking) return;
    setCompletingBookingId(booking_id);
    setModalPayment(booking.payment ? `₱${Number(booking.payment).toLocaleString()}` : "");
    setShowCompleteModal(true);
  };

  const closeCompleteModal = (): void => {
    setShowCompleteModal(false);
    setCompletingBookingId(null);
    setModalPayment("");
  };

  const confirmComplete = async (): Promise<void> => {
    if (!completingBookingId) return;

    const cleanedPayment = modalPayment.replace(/[^\d.]/g, "");
    if (!cleanedPayment || Number(cleanedPayment) === 0) {
      alert("Please enter a valid payment amount.");
      return;
    }

    const bookingToUpdate = bookings.find((b) => b.booking_id === completingBookingId);
    if (!bookingToUpdate) return;

    try {
      const updatedData = {
        ...bookingToUpdate,
        status: "completed",
        payment: Number(cleanedPayment),
      };

      const res = await fetch(`${SERVER_URL}/bookings/${completingBookingId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedData),
      });

      if (res.ok) {
        const updatedBooking: Booking = await res.json();
        setBookings((prev) =>
          prev.map((b) => (b.booking_id === completingBookingId ? updatedBooking : b))
        );
        alert("Booking marked as completed!");
        closeCompleteModal();
      } else {
        alert("Failed to complete booking.");
      }
    } catch (err) {
      console.error("Error completing booking:", err);
    }
  };

  // Filtered results
  // Filter both bookings and incoming requests
const filteredBookings = bookings.filter((b) =>
  [b.booking_id, b.user_id, b.service, b.address, b.name, b.status]
    .some((v) => v?.toLowerCase().includes(search.toLowerCase()))
);

const filteredRequests = incomingRequests.filter((r) =>
  [r.request_id, r.user_id, r.service, r.address, r.name, r.status]
    .some((v) => v?.toLowerCase().includes(search.toLowerCase()))
);


  return (
    <div className="app-container">
      <header className="app-header">
        <div className="header-inner">
          <div className="logo">
            <span className="logo-main">GenClean</span>
            <span className="logo-sub">| Manage Bookings</span>
          </div>
        </div>
      </header>

      <main className="app-main">
        <section className="analytics-hero">
          <div>
            <h1>Manage Bookings</h1>
            <p>View, approve, reject, and complete bookings.</p>
          </div>
          <div className="filter-controls">
            <input
              type="text"
              placeholder="Search bookings..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="search-input"
            />
          </div>
        </section>

        {/* Incoming Requests */}
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
                  filteredRequests.map((r) => (

                    <tr key={r.request_id}>
                      <td>{r.request_id}</td>
                      <td>{r.user_id}</td>
                      <td>{r.name || "—"}</td>
                      <td>{r.service}</td>
                      <td>{new Date(r.booking_date).toLocaleString()}</td>
                      <td>{r.address}</td>
                      <td>{r.for_assessment ? "Yes" : "No"}</td>
                      <td>{r.status || "Pending"}</td>
                      <td className="actions">
                        <button
                          onClick={() => openApproveModal(r.request_id)}
                          className="btn btn--approve"
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => openRejectModal(r.request_id)}
                          className="btn btn--reject"
                        >
                          Reject
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </section>

        {/* Bookings */}
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
                {filteredBookings.length === 0 ? (

                  <tr>
                    <td colSpan={11} style={{ textAlign: "center" }}>
                      No bookings found
                    </td>
                  </tr>
                ) : (
                  filteredBookings.map((b) => (

                    <tr key={b.booking_id}>
                      <td>{b.booking_id}</td>
                      <td>{b.user_id}</td>
                      <td>{b.name || "—"}</td>
                      <td>{b.service}</td>
                      <td>{new Date(b.booking_date).toLocaleString()}</td>
                      <td>{b.address}</td>
                      <td>{b.notes || "—"}</td>
                      <td>{b.for_assessment ? "Yes" : "No"}</td>
                      <td>{b.payment ? `₱${Number(b.payment).toLocaleString()}` : "—"}</td>
                      <td>
                        {b.status === "completed" ? (
                          <span className="status-badge completed">Completed</span>
                        ) : (
                          <span className="status-badge pending">Pending</span>
                        )}
                      </td>
                      <td className="actions">
                        {b.status === "pending" ? (
                          <button
                            onClick={() => openCompleteModal(b.booking_id)}
                            className="btn btn--complete"
                          >
                            Mark as Complete
                          </button>
                        ) : (
                          <span style={{ color: "#94a3b8", fontStyle: "italic" }}>Completed</span>
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
        © {new Date().getFullYear()} GenClean. All rights reserved.
      </footer>

      {/* Completion Modal */}
      {showCompleteModal && (
        <Modal
          title="Complete Booking"
          message="Once marked as completed, this booking cannot be edited."
          confirmText="Confirm Completion"
          cancelText="Cancel"
          onConfirm={confirmComplete}
          onCancel={closeCompleteModal}
        >
          <label htmlFor="modal-payment">Payment Amount *</label>
          <input
            id="modal-payment"
            type="text"
            className="modal-input"
            value={modalPayment}
            onChange={handleModalPaymentChange}
            placeholder="₱0.00"
            autoFocus
          />
        </Modal>
      )}

      {/* Approval Modal */}
      {showApproveModal && (
        <Modal
          title="Approve Request"
          message="Are you sure you want to approve this request? It will move to Bookings and notify the customer."
          confirmText="Confirm Approve"
          cancelText="Cancel"
          onConfirm={confirmApprove}
          onCancel={closeApproveModal}
        />
      )}

      {/* Rejection Modal */}
      {showRejectModal && (
        <Modal
          title="Reject Request"
          message="Please provide a reason (optional). This action cannot be undone."
          confirmText="Confirm Reject"
          cancelText="Cancel"
          onConfirm={confirmReject}
          onCancel={closeRejectModal}
        >
          <textarea
            className="modal-textarea"
            value={rejectReason}
            onChange={(e) => setRejectReason(e.target.value)}
            placeholder="Enter reason..."
          />
        </Modal>
      )}
    </div>
  );
}

// Reusable Modal
function Modal({
  title,
  message,
  confirmText,
  cancelText,
  onConfirm,
  onCancel,
  children,
}: {
  title: string;
  message?: string;
  confirmText: string;
  cancelText: string;
  onConfirm: () => void;
  onCancel: () => void;
  children?: React.ReactNode;
}) {
  return (
    <div className="modal-overlay" onClick={onCancel}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>{title}</h3>
        </div>
        <div className="modal-body">
          {message && <p>{message}</p>}
          {children}
        </div>
        <div className="modal-actions">
          <button onClick={onCancel} className="btn btn--cancel">
            {cancelText}
          </button>
          <button onClick={onConfirm} className="btn btn--complete">
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}

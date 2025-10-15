import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

interface User {
  id: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  email: string;
}

function Booksys() {
  const [user, setUser] = useState<User | null>(null);
  const [service, setService] = useState("");
  const [bookingDate, setBookingDate] = useState("");
  const [bookingTime, setBookingTime] = useState("");
  const [address, setAddress] = useState("");
  const [notes, setNotes] = useState("");
  const [forAssessment, setForAssessment] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) setUser(JSON.parse(storedUser));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage("");

    if (!user) {
      setMessage("You must be logged in to book a service.");
      setIsSubmitting(false);
      return;
    }

    if (!service || !bookingDate || !address) {
      setMessage("Please fill in all required fields.");
      setIsSubmitting(false);
      return;
    }

    // Combine date + time into ISO string
    const bookingDateTime = bookingTime
      ? new Date(`${bookingDate}T${bookingTime}`).toISOString()
      : new Date(bookingDate).toISOString();

    const bookingData = {
      user_id: user.id,
      service: service,
      booking_date: bookingDateTime,
      address: address,
      notes: notes,
      for_assessment: forAssessment,
    };

    try {
      const response = await fetch("https://capstone-ni5z.onrender.com/booking", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(bookingData),
      });

      const result = await response.json();

      if (response.ok) {
        setMessage("✅ Booking successful! Redirecting...");
        setService("");
        setBookingDate("");
        setBookingTime("");
        setAddress("");
        setNotes("");
        setForAssessment(false);

        setTimeout(() => navigate("/customerdashb"), 2000);
      } else {
        setMessage(result.message || "❌ Booking failed. Please try again.");
      }
    } catch (error) {
      console.error("Error:", error);
      setMessage("⚠️ An unexpected error occurred while booking.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <nav className="navbar navbar-expand-lg my-navbar sticky-top">
        <div className="container-fluid">
          <a className="navbar-brand" href="#">GenClean</a>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarSupportedContent"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
        </div>
      </nav>

      <div className="main-content-container">
        <div className="booking-box">
          <h2 className="booking-title">Book for Quotation!</h2>
          <form onSubmit={handleSubmit}>
            <div className="row g-4 booking-form">
              <div className="col-md-6 form-column">
                <div className="form-group mb-4">
                  <label className="form-label">Service:</label>
                  <select
                    className="form-select booking-input"
                    value={service}
                    onChange={(e) => setService(e.target.value)}
                    required
                  >
                    <option value="">Select a service</option>
                    <option value="General Maintenance">General Maintenance</option>
                    <option value="Janitorial and Cleaning Services">Janitorial and Cleaning Services</option>
                    <option value="Pest Control">Pest Control</option>
                  </select>
                </div>

                <div className="form-group mb-4">
                  <label className="form-label">Desired Date:</label>
                  <input
                    type="date"
                    className="form-control booking-input"
                    value={bookingDate}
                    onChange={(e) => setBookingDate(e.target.value)}
                    required
                  />
                </div>

                <div className="form-group mb-4">
                  <label className="form-label">Desired Time:</label>
                  <input
                    type="time"
                    className="form-control booking-input"
                    value={bookingTime}
                    onChange={(e) => setBookingTime(e.target.value)}
                  />
                </div>

                <div className="form-group mb-4">
                  <label className="form-label">Address:</label>
                  <textarea
                    className="form-control booking-input"
                    rows={2}
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    required
                  ></textarea>
                </div>

                <div className="form-group mb-4">
                  <label className="form-label">Notes:</label>
                  <textarea
                    className="form-control booking-input"
                    rows={3}
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                  ></textarea>
                </div>

                <div className="form-check mb-4 d-flex align-items-center">
                  <label className="form-check-label me-3">For Assessment:</label>
                  <input
                    type="checkbox"
                    className="form-check-input"
                    checked={forAssessment}
                    onChange={(e) => setForAssessment(e.target.checked)}
                  />
                </div>
              </div>

              <div className="col-md-6 customer-details">
                <h5 className="details-title">Customer Details:</h5>
                {user ? (
                  <>
                    <div className="detail-item">
                      <span className="detail-label">Name:</span>
                      <span className="detail-value">
                        {user.firstName} {user.lastName}
                      </span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">Phone:</span>
                      <span className="detail-value">{user.phoneNumber}</span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">Email Address:</span>
                      <span className="detail-value">{user.email}</span>
                    </div>
                  </>
                ) : (
                  <p>Please log in to view your details.</p>
                )}
              </div>
            </div>

            <div className="text-center mt-5">
              <button
                className="btn book-now-btn"
                type="submit"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Booking..." : "Book Now!"}
              </button>
            </div>
          </form>

          {message && <div className="mt-3 text-center">{message}</div>}
        </div>
      </div>
    </>
  );
}

export default Booksys;

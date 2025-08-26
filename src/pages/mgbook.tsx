import { useState } from "react";
import "../admin.css";

interface Booking {
  id: string;
  name: string;
  date: string;
  status: string;
  service: string;
  notes: string;
}

function Mgbook() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const bookings: Booking[] = [
    {
      id: "123",
      name: "Jane Doe",
      date: "10/25/2026",
      status: "Pending",
      service: "General Cleaning",
      notes: "Customer requested specific cleaning products to be used.",
    },
    {
      id: "124",
      name: "John Smith",
      date: "10/26/2026",
      status: "Done",
      service: "Deep Cleaning",
      notes: "No specific notes from the customer.",
    },
    {
      id: "125",
      name: "Emily White",
      date: "10/27/2026",
      status: "Cancelled",
      service: "Move-Out Cleaning",
      notes: "Cancellation due to change in moving date.",
    },
    {
      id: "126",
      name: "Michael Brown",
      date: "10/28/2026",
      status: "Pending",
      service: "Carpet Cleaning",
      notes: "Client will provide their own vacuum cleaner.",
    },
    {
      id: "127",
      name: "Jessica Green",
      date: "10/29/2026",
      status: "Done",
      service: "General Cleaning",
      notes: "Completed as per client's request.",
    },
  ];

  const handleViewClick = (booking: Booking) => {
    setSelectedBooking(booking);
  };

  return (
    <>
      <nav className="navbar my-navbar sticky-top">
        <div className="container-fluid">
          <a className="navbar-brand" href="#">
            GenClean
          </a>
          <button
            className="navbar-toggler ms-auto"
            type="button"
            onClick={toggleSidebar}
            aria-label="Toggle navigation"
            aria-expanded={isSidebarOpen}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              fill="currentColor"
              className="bi bi-list"
              viewBox="0 0 16 16"
            >
              <path
                fillRule="evenodd"
                d="M2.5 12a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5m0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5m0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5"
              />
            </svg>
          </button>
        </div>
      </nav>

      <div className={`sidebar right-aligned ${isSidebarOpen ? "open" : ""}`}>
        <button className="close-btn" onClick={toggleSidebar}>
          &times;
        </button>
        <ul className="sidebar-nav">
          <li>
            <a href="#">Manage Bookings</a>
          </li>
          <li>
            <a href="#">Sales and Request</a>
          </li>
          <li>
            <a href="#">Customer Analytics</a>
          </li>
          <li>
            <a href="#">Sign out</a>
          </li>
        </ul>
      </div>

      <div className={`dashbg ${isSidebarOpen ? "shifted" : ""}`}>
        <div className="section-container">
          <h2>Bookings</h2>
          <div className="search-container">
            <input type="text" placeholder="Search" className="search-input" />
            <div className="search-icon">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                fill="currentColor"
                className="bi bi-search"
                viewBox="0 0 16 16"
              >
                <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001q.044.06.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1 1 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0" />
              </svg>
            </div>
          </div>
          <div className="table-wrapper">
            <table className="bookings-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Date</th>
                  <th>Status</th>
                  <th>View</th>
                </tr>
              </thead>
              <tbody>
                {bookings.map((booking) => (
                  <tr key={booking.id}>
                    <td>{booking.id}</td>
                    <td>{booking.name}</td>
                    <td>{booking.date}</td>
                    <td>{booking.status}</td>
                    <td>
                      <button onClick={() => handleViewClick(booking)}>
                        View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {selectedBooking && (
          <div className="section-container booking-details-container">
            <h2 className="details-header">Booking Details</h2>
            <div className="details-grid">
              <div className="detail-item">
                <span className="detail-label">Booking ID:</span>
                <span className="detail-value">{selectedBooking.id}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Name:</span>
                <span className="detail-value">{selectedBooking.name}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Service:</span>
                <span className="detail-value">{selectedBooking.service}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Date:</span>
                <span className="detail-value">{selectedBooking.date}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Status:</span>
                <span className="detail-value">{selectedBooking.status}</span>
              </div>
              <div className="detail-item full-width">
                <span className="detail-label">Notes:</span>
                <span className="detail-value">{selectedBooking.notes}</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default Mgbook;

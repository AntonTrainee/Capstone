import React from "react";
import { Link } from "react-router-dom";
import genmain from "../assets/general-maintenance.jpg";
import janitor from "../assets/janitorial-services-1536x1024.jpg";
import pest from "../assets/pest-control-UT-hybridpestcontrol-scaled-2560x1280.jpeg";

function CustomerDashb() {
  return (
    <>
      <nav className="navbar navbar-expand-lg my-navbar sticky-top">
        <div className="container-fluid">
          <a className="navbar-brand" href="#">
            GenClean
          </a>
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

      <div className="dashboard-content">
        <div className="left-column-content">
          <div className="booked-services-column">
            <div className="booked-services-card">
              <h1 className="booked-services-title" id="Bookings">
                Booked Services
              </h1>

              <div className="table-container">
                <table className="bookings-table">
                  <thead>
                    <tr>
                      <th>Service ID</th>
                      <th>Service Type</th>
                      <th>Address</th>
                      <th>Date & Time</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>001</td>
                      <td>Cleaning</td>
                      <td>123 Main St</td>
                      <td>2025-08-20 10:00 AM</td>
                      <td>Completed</td>
                    </tr>
                    <tr>
                      <td>002</td>
                      <td>Maintenance</td>
                      <td>45 Elm Ave</td>
                      <td>2025-08-21 2:00 PM</td>
                      <td>Pending</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div className="change-section">
                <p className="change-text-title">Need to change something?</p>
                <p className="change-text-subtitle">
                  For booking changes or cancellations, please contact our
                  Support Team.
                </p>
                <button className="contact-support-btn">Contact Support</button>
              </div>
            </div>
          </div>

          <div
            id="services"
            className="container services-section"
            style={{ marginTop: "110px", marginBottom: "70px" }}
          >
            <h2 className="text-center mb-4">Services</h2>
            <div className="row g-4">
              <div className="col-md-6 col-lg-4">
                <div className="card h-100">
                  <img
                    src={genmain}
                    className="card-img-top"
                    alt="General Maintenance"
                  />
                  <div className="card-body">
                    <h5 className="card-title">General Maintenance</h5>
                    <a href="#" className="btn btn-primary">
                      Learn
                    </a>
                  </div>
                </div>
              </div>

              <div className="col-md-6 col-lg-4">
                <div className="card h-100">
                  <img
                    src={janitor}
                    className="card-img-top"
                    alt="Janitorial Services"
                  />
                  <div className="card-body">
                    <h5 className="card-title">
                      Janitorial and Cleaning Services
                    </h5>
                    <a href="#" className="btn btn-primary">
                      Learn more
                    </a>
                  </div>
                </div>
              </div>

              <div className="col-md-6 col-lg-4">
                <div className="card h-100">
                  <img src={pest} className="card-img-top" alt="Pest Control" />
                  <div className="card-body">
                    <h5 className="card-title">Pest Control</h5>
                    <a href="#" className="btn btn-primary">
                      Learn more
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <footer className="gray-rectangle">
            <div>
              <p>Contacts*</p>
              <p>Social Media links*</p>
            </div>
          </footer>
        </div>

        <div className="profile-column">
          <div className="profile-card">
            <div className="profile-icon">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="currentColor"
                viewBox="0 0 16 16"
              >
                <path d="M11 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0" />
                <path
                  fillRule="evenodd"
                  d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8m8-7a7 7 0 0 0-5.468 11.37C3.242 11.226 4.805 10 8 10s4.757 1.225 5.468 2.37A7 7 0 0 0 8 1"
                />
              </svg>
            </div>
            <h2 className="client-name">Client's Name</h2>
            <a href="#Bookings" className="profile-link">
              Bookings
            </a>

            <Link to="#" className="profile-link">
              History
            </Link>
            <Link to="/booksys" className="profile-link">
              Book
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}

export default CustomerDashb;

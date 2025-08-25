import React, { useState } from "react";
import "../admin.css";

function Admindashb() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
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
            aria-controls="sidebar"
            aria-expanded={isSidebarOpen}
            aria-label="Toggle navigation"
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
          <h2>Manage Bookings</h2>
          <div className="table-wrapper">
            <table className="manage-bookings-table">
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
                <tr>
                  <td>123</td>
                  <td>Jane Doe</td>
                  <td>10/25/2026</td>
                  <td>Pending</td>
                  <td>View</td>
                </tr>
                <tr>
                  <td>124</td>
                  <td>John Smith</td>
                  <td>10/26/2026</td>
                  <td>Done</td>
                  <td>View</td>
                </tr>
                <tr>
                  <td>125</td>
                  <td>Emily White</td>
                  <td>10/27/2026</td>
                  <td>Cancelled</td>
                  <td>View</td>
                </tr>
                <tr>
                  <td>126</td>
                  <td>Michael Brown</td>
                  <td>10/28/2026</td>
                  <td>Pending</td>
                  <td>View</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className="view-more">
            <a href="#">View More &rarr;</a>
          </div>
        </div>

        <div className="section-container">
          <h2>Sales and Request</h2>
          <div className="table-wrapper">
            <table className="sales-request-table">
              <thead>
                <tr>
                  <th>Customer</th>
                  <th>Service</th>
                  <th>Amount</th>
                  <th>Status</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>JANE</td>
                  <td>General Cleaning</td>
                  <td>₱ 1,250</td>
                  <td>Done</td>
                  <td>10/25/2026</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className="view-more">
            <a href="#">View More &rarr;</a>
          </div>
        </div>

        <div className="section-container">
          <h2>Customer Analytics</h2>
          <div className="table-wrapper">
            <table className="customer-analytics-table">
              <thead>
                <tr>
                  <th>DATE</th>
                  <th>SERVICES</th>
                  <th>AMOUNT</th>
                  <th>Status</th>
                  <th>CLEANER/EMPLOYEE</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>09/03/24</td>
                  <td>General Cleaning</td>
                  <td>₱ 1,200</td>
                  <td>Paid</td>
                  <td>Allen kopal of Employee</td>
                </tr>
                <tr>
                  <td>12/14/24</td>
                  <td>General Cleaning</td>
                  <td>₱ 2,254</td>
                  <td>Paid</td>
                  <td>Name of Employee</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className="view-more">
            <a href="#">View More &rarr;</a>
          </div>
        </div>
      </div>
    </>
  );
}

export default Admindashb;
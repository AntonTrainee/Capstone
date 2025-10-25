import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import logo from "../assets/Gemini_Generated_Image_bmrzg0bmrzg0bmrz-removebg-preview.png";

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
  const [bookingDate, setBookingDate] = useState<Date | null>(null);
  const [bookingTime, setBookingTime] = useState("");
  const [region] = useState("NCR");
  const [city, setCity] = useState("");
  const [barangay, setBarangay] = useState("");
  const [street, setStreet] = useState("");
  const [notes, setNotes] = useState("");
  const [forAssessment, setForAssessment] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState("");

  const [errors, setErrors] = useState({
    service: "",
    bookingDate: "",
    bookingTime: "",
    address: "",
  });

  const [fullyBookedDates, setFullyBookedDates] = useState<Date[]>([]);

  const navigate = useNavigate();
  const today = new Date();

  const ncrData: Record<string, string[]> = {
    Manila: [
      "Binondo",
      "Ermita",
      "Malate",
      "Paco",
      "Pandacan",
      "Sampaloc",
      "Santa Cruz",
      "Tondo",
    ],
    Makati: [
      "Bangkal",
      "Bel-Air",
      "Carmona",
      "Cembo",
      "Comembo",
      "Dasmariñas",
      "East Rembo",
      "Forbes Park",
      "Guadalupe Nuevo",
      "Guadalupe Viejo",
      "Kasilawan",
      "La Paz",
      "Magallanes",
      "Olympia",
      "Palanan",
      "Pembo",
      "Pinagkaisahan",
      "Pio del Pilar",
      "Pitogo",
      "Poblacion",
      "Rizal",
      "San Antonio",
      "San Isidro",
      "San Lorenzo",
      "Santa Cruz",
      "Singkamas",
      "South Cembo",
      "Tejeros",
      "Urdaneta",
      "Valenzuela",
      "West Rembo",
    ],
    Taguig: [
      "Bagumbayan",
      "Bambang",
      "Calzada-Tipas",
      "Comembo",
      "Cembo",
      "Central Bicutan",
      "Central Signal Village",
      "East Rembo",
      "Fort Bonifacio",
      "Hagonoy",
      "Ibayo-Tipas",
      "Katuparan",
      "Ligid-Tipas",
      "Lower Bicutan",
      "Maharlika Village",
      "Napindan",
      "New Lower Bicutan",
      "North Daang Hari",
      "North Signal Village",
      "Palingon-Tipas",
      "Pembo",
      "Pinagsama",
      "Pitogo",
      "Post Proper Northside",
      "Post Proper Southside",
      "Rizal",
      "San Miguel",
      "Santa Ana",
      "South Cembo",
      "South Daang Hari",
      "South Signal Village",
      "Tanyag",
      "Tuktukan",
      "Upper Bicutan",
      "Ususan",
      "Wawa",
      "Western Bicutan",
    ],
    Pasig: [
      "Bagong Ilog",
      "Bagong Katipunan",
      "Bambang",
      "Buting",
      "Caniogan",
      "Dela Paz",
      "Kalawaan",
      "Kapasigan",
      "Kapitolyo",
      "Malinao",
      "Manggahan",
      "Maybunga",
      "Oranbo",
      "Palatiw",
      "Pinagbuhatan",
      "Pineda",
      "Rosario",
      "Sagad",
      "San Antonio",
      "San Joaquin",
      "San Jose",
      "San Miguel",
      "San Nicolas",
      "Santa Cruz",
      "Santa Lucia",
      "Santa Rosa",
      "Santo Tomas",
      "Santolan",
      "Sumilang",
      "Ugong",
    ],
    Parañaque: [
      "BF Homes",
      "Don Bosco",
      "San Antonio",
      "San Dionisio",
      "Tambo",
    ],
    "Las Piñas": [
      "Almanza Uno",
      "Pamplona Tres",
      "Pulang Lupa Uno",
      "Zapote",
      "Talon Dos",
    ],
    Mandaluyong: [
      "Addition Hills",
      "Barangka Drive",
      "Burol",
      "Mauway",
      "Plainview",
    ],
    Marikina: [
      "Barangka",
      "Concepcion Uno",
      "Industrial Valley",
      "Parang",
      "Tañong",
    ],
    Muntinlupa: ["Alabang", "Bayanan", "Cupang", "Poblacion", "Putatan"],
    Caloocan: ["Bagong Barrio", "Grace Park", "Maypajo", "Sangandaan", "Tala"],
    Malabon: ["Catmon", "Dampalit", "Muzon", "Tonsuya", "Tinajeros"],
    Navotas: [
      "Daanghari",
      "North Bay Boulevard North",
      "San Jose",
      "San Rafael Village",
      "Sipac-Almacen",
    ],
    Valenzuela: [
      "Bagbaguin",
      "Balangkas",
      "Canumay East",
      "Karuhatan",
      "Marulas",
    ],
  };

  // Fetch user
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) setUser(JSON.parse(storedUser));
  }, []);

  // Fetch fully booked dates
  useEffect(() => {
    async function fetchFullyBooked() {
      try {
        const res = await fetch(
          `https://capstone-ni5z.onrender.com/fully-booked-dates`
        );
        const data: string[] = await res.json(); // assuming backend returns ["2025-10-25", "2025-10-26", ...]
        const dates = data.map((d) => new Date(d));
        setFullyBookedDates(dates);
      } catch (err) {
        console.error("Error fetching fully booked dates:", err);
      }
    }
    fetchFullyBooked();
  }, []);

  const isDateAvailable = (date: Date) => {
    return !fullyBookedDates.some(
      (booked) => booked.toDateString() === date.toDateString()
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage("");

    const address =
      street && barangay && city
        ? `${street}, ${barangay}, ${city}, ${region}`
        : "";
    const newErrors = {
      service: service ? "" : "Please select a service.",
      bookingDate: bookingDate ? "" : "Please select a date.",
      bookingTime: bookingTime ? "" : "Please select a time.",
      address: address ? "" : "Please complete the address.",
    };
    setErrors(newErrors);

    if (!service || !bookingDate || !bookingTime || !address) {
      setIsSubmitting(false);
      return;
    }

    if (!user) {
      setMessage("You must be logged in to book a service.");
      setIsSubmitting(false);
      return;
    }

    const bookingDateTime = bookingDate.toISOString();

    const requestData = {
      user_id: user.id,
      name: `${user.firstName} ${user.lastName}`,
      service,
      booking_date: bookingDateTime,
      address,
      notes,
      for_assessment: forAssessment,
    };

    try {
      const response = await fetch(
        "https://capstone-ni5z.onrender.com/incoming-requests",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(requestData),
        }
      );
      const result = await response.json();

      if (response.ok) {
        setMessage("✅ Request submitted successfully! Redirecting...");
        setService("");
        setBookingDate(null);
        setBookingTime("");
        setCity("");
        setBarangay("");
        setStreet("");
        setNotes("");
        setForAssessment(false);
        setErrors({
          service: "",
          bookingDate: "",
          bookingTime: "",
          address: "",
        });
        setTimeout(() => navigate("/customerdashb"), 2000);
      } else {
        setMessage(
          result.message || "❌ Failed to submit request. Please try again."
        );
      }
    } catch (error) {
      console.error("Error submitting request:", error);
      setMessage(
        "⚠️ An unexpected error occurred while submitting your request."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <nav className="navbar navbar-expand-lg my-navbar sticky-top">
        <div className="container-fluid">
          <Link className="navbar-brand d-flex align-items-center" to="/">
            <img
              src={logo}
              alt="Gemini Logo"
              className="img-fluid"
              style={{ maxHeight: "60px" }}
            />
          </Link>
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
                  >
                    <option value="">Select a service</option>
                    <option value="General Maintenance">
                      General Maintenance
                    </option>
                    <option value="Janitorial and Cleaning Services">
                      Janitorial and Cleaning Services
                    </option>
                    <option value="Pest Control">Pest Control</option>
                  </select>
                  {errors.service && (
                    <small className="text-danger">{errors.service}</small>
                  )}
                </div>

                <div className="form-group mb-4">
                  <label className="form-label">Desired Date:</label>
                  <DatePicker
                    selected={bookingDate}
                    onChange={(date: Date | null) => setBookingDate(date)}
                    filterDate={isDateAvailable}
                    minDate={today}
                    className="form-control booking-input"
                    placeholderText="Select a date"
                    dateFormat="yyyy-MM-dd"
                  />
                  {errors.bookingDate && (
                    <small className="text-danger">{errors.bookingDate}</small>
                  )}
                </div>

                <div className="form-group mb-4">
                  <label className="form-label">Desired Time:</label>
                  <input
                    type="time"
                    className="form-control booking-input"
                    value={bookingTime}
                    onChange={(e) => setBookingTime(e.target.value)}
                  />
                  {errors.bookingTime && (
                    <small className="text-danger">{errors.bookingTime}</small>
                  )}
                </div>

                <div className="form-group mb-4">
                  <label className="form-label">Region:</label>
                  <input
                    type="text"
                    className="form-control"
                    value={region}
                    readOnly
                  />
                </div>

                <div className="form-group mb-4">
                  <label className="form-label">City:</label>
                  <select
                    className="form-select booking-input"
                    value={city}
                    onChange={(e) => {
                      setCity(e.target.value);
                      setBarangay("");
                    }}
                  >
                    <option value="">Select City</option>
                    {Object.keys(ncrData).map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group mb-4">
                  <label className="form-label">Municipality / Barangay:</label>
                  <select
                    className="form-select booking-input"
                    value={barangay}
                    onChange={(e) => setBarangay(e.target.value)}
                    disabled={!city}
                  >
                    <option value="">
                      {city ? "Select Barangay" : "Select a city first"}
                    </option>
                    {city &&
                      ncrData[city].map((b) => (
                        <option key={b} value={b}>
                          {b}
                        </option>
                      ))}
                  </select>
                </div>

                <div className="form-group mb-4">
                  <label className="form-label">Street / Unit Number:</label>
                  <input
                    type="text"
                    className="form-control booking-input"
                    value={street}
                    onChange={(e) => setStreet(e.target.value)}
                    placeholder="e.g. Blk 12 Lot 4, Phase 3"
                  />
                  {errors.address && (
                    <small className="text-danger">{errors.address}</small>
                  )}
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
                  <i
                    className="bi bi-question-diamond-fill text-primary ms-1 me-1"
                    data-bs-toggle="tooltip"
                    data-bs-placement="right"
                    title="Selecting this means our team will first assess your location or service area before giving a final quotation."
                    style={{ cursor: "pointer", fontSize: "1rem" }}
                  ></i>
                  <label className="form-check-label me-2">
                    For Assessment:
                  </label>
                  <input
                    type="checkbox"
                    className="form-check-input ms-2"
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
                {isSubmitting ? "Submitting..." : "Book Now!"}
              </button>
              {message && <p className="mt-2 text-warning">{message}</p>}
            </div>
          </form>
        </div>
      </div>
    </>
  );
}

export default Booksys;

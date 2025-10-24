import { Link } from "react-router-dom";
import { useState } from "react";
import genmain from "../assets/general-maintenance.jpg";
import janitor from "../assets/janitorial-services-1536x1024.jpg";
import pest from "../assets/pest-control-UT-hybridpestcontrol-scaled-2560x1280.jpeg";
import Navbar from "../components/navbar";
import pesto from "../assets/pestcontro.jpg";
import fact from "../assets/Factory.jpg";
import clean from "../assets/cleaners.jpg";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import Footer from "../components/footer";
import HomeReviews from "../pages/HomeReviews";

function Home() {
  // --- state for form inputs ---
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    address: "",
    phone: "",
    message: "",
  });

  const [status, setStatus] = useState("");

  // ================== PHONE NUMBER FORMAT ==================
  const handlePhoneInput = (value: string) => {
    let digits = value.replace(/\D/g, "");
    if (!digits.startsWith("09"))
      digits = "09" + digits.slice(digits.startsWith("0") ? 1 : 0);
    if (digits.length > 11) digits = digits.slice(0, 11);

    let formatted = digits;
    if (digits.length > 4 && digits.length <= 7) {
      formatted = digits.slice(0, 4) + "-" + digits.slice(4);
    } else if (digits.length > 7) {
      formatted =
        digits.slice(0, 4) + "-" + digits.slice(4, 7) + "-" + digits.slice(7);
    }

    setFormData({ ...formData, phone: formatted });
  };

  // --- handle input changes (for non-phone fields) ---
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  // --- handle submit ---
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("Sending...");

    try {
      const res = await fetch("https://capstone-ni5z.onrender.com/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        setStatus("Message sent successfully!");
        setFormData({
          name: "",
          email: "",
          address: "",
          phone: "",
          message: "",
        });
      } else {
        setStatus("Failed to send. Please try again later.");
      }
    } catch (err) {
      console.error(err);
      setStatus("An error occurred.");
    }
  };

  return (
    <>
      <Navbar />

      <div id="home" className="hero-section">
        <div
          id="carouselExampleIndicators"
          className="carousel slide hero-section mb-5"
          data-bs-ride="carousel"
        >
          <div className="carousel-indicators">
            <button
              type="button"
              data-bs-target="#carouselExampleIndicators"
              data-bs-slide-to="0"
              className="active"
            ></button>
            <button
              type="button"
              data-bs-target="#carouselExampleIndicators"
              data-bs-slide-to="1"
            ></button>
            <button
              type="button"
              data-bs-target="#carouselExampleIndicators"
              data-bs-slide-to="2"
            ></button>
          </div>
          <div className="carousel-inner">
            <div className="carousel-item active">
              <img src={pesto} className="d-block w-100" alt="Slide 1" />
            </div>
            <div className="carousel-item">
              <img src={fact} className="d-block w-100" alt="Slide 2" />
            </div>
            <div className="carousel-item">
              <img src={clean} className="d-block w-100" alt="Slide 3" />
            </div>
          </div>
          <button
            className="carousel-control-prev"
            type="button"
            data-bs-target="#carouselExampleIndicators"
            data-bs-slide="prev"
          >
            <span
              className="carousel-control-prev-icon"
              aria-hidden="true"
            ></span>
          </button>
          <button
            className="carousel-control-next"
            type="button"
            data-bs-target="#carouselExampleIndicators"
            data-bs-slide="next"
          >
            <span
              className="carousel-control-next-icon"
              aria-hidden="true"
            ></span>
          </button>
        </div>

        <div className="centerContainer">
          <div className="CompIntro">
            <h1>Welcome to GenClean</h1>
            <p>
              Your trusted partner for hassle-free booking of <br />
              General Cleaning, Janitorial Services, and Pest Control.
            </p>
            <Link to="/Register" className="btn custom-outline">
              Book Now
            </Link>
          </div>
        </div>
      </div>

      <div
        id="services"
        className="container"
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
                <Link to="/services" className="btn btn-primary">
                  Learn more
                </Link>
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
                <h5 className="card-title">Janitorial and Cleaning Services</h5>
                <Link to="/services" className="btn btn-primary">
                  Learn more
                </Link>
              </div>
            </div>
          </div>

          <div className="col-md-6 col-lg-4">
            <div className="card h-100">
              <img src={pest} className="card-img-top" alt="Pest Control" />
              <div className="card-body">
                <h5 className="card-title">Pest Control</h5>
                <Link to="/services" className="btn btn-primary">
                  Learn more
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      <HomeReviews />

      <section
        id="contact"
        className="contactcontainer"
        style={{
          marginTop: "110px",
          marginRight: "auto",
          marginBottom: "70px",
          marginLeft: "auto",
          maxWidth: "900px",
        }}
      >
        <h2 className="text-center section-title">Contact Us</h2>

        <form className="contact-form" onSubmit={handleSubmit}>
          <div className="row mb-3">
            <div className="col-md-6 mb-3">
              <div className="form-floating">
                <input
                  type="text"
                  className="form-control"
                  id="name"
                  placeholder="Name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
                <label htmlFor="name">Name</label>
              </div>
            </div>

            <div className="col-md-6 mb-3">
              <div className="form-floating">
                <input
                  type="email"
                  className="form-control"
                  id="email"
                  placeholder="Email Address"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
                <label htmlFor="email">Email address</label>
              </div>
            </div>
          </div>

          <div className="mb-3">
            <div className="form-floating">
              <input
                type="text"
                className="form-control"
                id="address"
                placeholder="Address"
                value={formData.address}
                onChange={handleChange}
                required
              />
              <label htmlFor="address">Address</label>
            </div>
          </div>

          <div className="mb-3">
            <div className="form-floating">
              <input
                type="tel"
                className="form-control"
                id="phone"
                placeholder="Phone Number"
                value={formData.phone}
                onChange={(e) => handlePhoneInput(e.target.value)}
                required
              />
              <label htmlFor="phone">Phone number</label>
            </div>
          </div>

          <div className="mb-3">
            <div className="form-floating">
              <textarea
                className="form-control"
                placeholder="Message"
                id="message"
                style={{ height: "150px" }}
                value={formData.message}
                onChange={handleChange}
                required
              ></textarea>
              <label htmlFor="message">Message</label>
            </div>
          </div>

          <div className="text-center">
            <button type="submit" className="btn submit-btn">
              Submit
            </button>
          </div>
        </form>

        {status && <p className="text-center mt-3">{status}</p>}

        <div className="row mt-4">
          <div className="col-md-8 mb-3">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3861.1607937920303!2d121.05910737433089!3d14.589911877339839!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3397c8198c943bdb%3A0xf92bf96244ed9ae8!2sCorinthian%20Executive%20Regency%2C%20Ortigas%20Ave%2C%20Ortigas%20Center%2C%20Pasig%2C%20Metro%20Manila!5e0!3m2!1sen!2sph!4v1760433345917!5m2!1sen!2sph"
              style={{ border: 0, height: "400px", width: "100%" }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>

          <div className="col-md-4">
            <div className="info-card h-100 d-flex flex-column justify-content-center">
              <p className="bold" style={{ color: "#2a4d57ff" }}>
                Business Hours:
              </p>
              <p style={{ color: "#2a4d57ff" }}>
                Monday – Saturday, 9:00 AM – 6:00 PM
              </p>

              <p className="bold mt-3" style={{ color: "#2a4d57ff" }}>
                Address:
              </p>
              <p style={{ color: "#2a4d57ff" }}>
                Unit 114, 2nd Floor, Corinthian Executive Regency,
                <br />
                Ortigas Ave., San Antonio, Pasig City
              </p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}

export default Home;

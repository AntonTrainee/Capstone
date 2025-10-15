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

function Home() {
// --- state for form inputs ---
const [formData, setFormData] = useState({
  name: "",
  email: "",
  phone: "",
  message: "",
});

const [status, setStatus] = useState("");

// --- handle input changes ---
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
    const res = await fetch("http://localhost:3007/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });

    if (res.ok) {
      setStatus("Message sent successfully!");
      setFormData({ name: "", email: "", phone: "", message: "" });
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

      <div className="reviews"style={{ marginTop: "110px" }}>
        <h2 className="text-center mb-4">Reviews and Testimonials</h2>
        <div
  id="reviewCarousel"
  className="carousel slide"
  data-bs-ride="carousel"
  data-bs-interval="4000"
  style={{
    width: "100vw",
    marginTop: "110px",
    marginBottom: "70px",
  }}
>
  <div className="carousel-inner text-center p-5 review-carousel rounded shadow">
    <div className="carousel-item active">
      <h5>⭐⭐⭐⭐⭐</h5>
      <p className="mb-1">
        <strong>"The team was incredibly professional and thorough."</strong>
      </p>
      <p className="text-muted">— Maria L., Quezon City</p>
    </div>

    <div className="carousel-item" data-bs-interval="4000">
      <h5>⭐⭐⭐⭐⭐</h5>
      <p className="mb-1">
        <strong>"Super easy to book and they actually show up on time."</strong>
      </p>
      <p className="text-muted">— Kevin R., Taguig</p>
    </div>

    <div className="carousel-item" data-bs-interval="4000">
      <h5>⭐⭐⭐⭐</h5>
      <p className="mb-1">
        <strong>
          "Great pest control service. Just a bit of smell after, but it cleared out fast."
        </strong>
      </p>
      <p className="text-muted">— Angela M., Pasig City</p>
    </div>

    <div className="carousel-item" data-bs-interval="4000">
      <h5>⭐⭐⭐⭐⭐</h5>
      <p className="mb-1">
        <strong>"Worth every peso."</strong>
      </p>
      <p className="text-muted">— Joshua C., Makati</p>
    </div>

    <div className="carousel-item" data-bs-interval="4000">
      <h5>⭐⭐⭐⭐☆</h5>
      <p className="mb-1">
        <strong>"Friendly staff, responsive support."</strong>
      </p>
      <p className="text-muted">— Diana F., Caloocan</p>
    </div>
  </div>

  {/* Optional Controls (adds manual nav) */}
  <button
    className="carousel-control-prev"
    type="button"
    data-bs-target="#reviewCarousel"
    data-bs-slide="prev"
  >
    <span className="carousel-control-prev-icon" aria-hidden="true"></span>
  </button>
  <button
    className="carousel-control-next"
    type="button"
    data-bs-target="#reviewCarousel"
    data-bs-slide="next"
  >
    <span className="carousel-control-next-icon" aria-hidden="true"></span>
  </button>
</div>
      </div>

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
              type="tel"
              className="form-control"
              id="phone"
              placeholder="Phone Number"
              value={formData.phone}
              onChange={handleChange}
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
              <p className="bold">Business Hours:</p>
              <p>Monday – Saturday, 9:00 AM – 6:00 PM</p>

              <p className="bold mt-3">Address:</p>
              <p>
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


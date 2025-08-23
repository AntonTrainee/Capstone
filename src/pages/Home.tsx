import { Link } from "react-router-dom";
import one from "../assets/one-piece.jpg";
import slide1 from "../assets/download (1).jpg";
import slide2 from "../assets/download (2).jpg";
import genmain from "../assets/general-maintenance.jpg";
import janitor from "../assets/janitorial-services-1536x1024.jpg";
import pest from "../assets/pest-control-UT-hybridpestcontrol-scaled-2560x1280.jpeg";
import Navbar from "../components/navbar";

function Home() {
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
              <img src={slide1} className="d-block w-100" alt="Slide 1" />
            </div>
            <div className="carousel-item">
              <img src={slide2} className="d-block w-100" alt="Slide 2" />
            </div>
            <div className="carousel-item">
              <img src={one} className="d-block w-100" alt="Slide 3" />
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
                <h5 className="card-title">Janitorial and Cleaning Services</h5>
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

      <div className="reviews">
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
          <h2 className="text-center mb-4">Reviews and Testimonials</h2>
          <div className="carousel-inner text-center p-5 review-carousel rounded shadow">
            <div className="carousel-item active">
              <h5>⭐⭐⭐⭐⭐</h5>
              <p className="mb-1">
                <strong>
                  "The team was incredibly professional and thorough."
                </strong>
              </p>
              <p className="text-muted">— Maria L., Quezon City</p>
            </div>
            <div className="carousel-item">
              <h5>⭐⭐⭐⭐⭐</h5>
              <p className="mb-1">
                <strong>
                  "Super easy to book and they actually show up on time."
                </strong>
              </p>
              <p className="text-muted">— Kevin R., Taguig</p>
            </div>
            <div className="carousel-item">
              <h5>⭐⭐⭐⭐☆</h5>
              <p className="mb-1">
                <strong>
                  "Great pest control service. Just a bit of smell after, but it
                  cleared out fast."
                </strong>
              </p>
              <p className="text-muted">— Angela M., Pasig City</p>
            </div>
            <div className="carousel-item">
              <h5>⭐⭐⭐⭐⭐</h5>
              <p className="mb-1">
                <strong>"Worth every peso."</strong>
              </p>
              <p className="text-muted">— Joshua C., Makati</p>
            </div>
            <div className="carousel-item">
              <h5>⭐⭐⭐⭐☆</h5>
              <p className="mb-1">
                <strong>"Friendly staff, responsive support."</strong>
              </p>
              <p className="text-muted">— Diana F., Caloocan</p>
            </div>
          </div>
        </div>
      </div>

      <div
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
        <form className="contact-form">
          <div className="row mb-3">
            <div className="col-md-6 mb-3">
              <div className="form-floating">
                <input
                  type="text"
                  className="form-control"
                  id="floatingName"
                  placeholder="Name"
                />
                <label htmlFor="floatingName">Name</label>
              </div>
            </div>
            <div className="col-md-6 mb-3">
              <div className="form-floating">
                <input
                  type="email"
                  className="form-control"
                  id="floatingEmail"
                  placeholder="Email Address"
                />
                <label htmlFor="floatingEmail">Email address</label>
              </div>
            </div>
          </div>

          <div className="mb-3">
            <div className="form-floating">
              <input
                type="tel"
                className="form-control"
                id="floatingPhone"
                placeholder="Phone Number"
              />
              <label htmlFor="floatingPhone">Phone number</label>
            </div>
          </div>

          <div className="mb-3">
            <div className="form-floating">
              <textarea
                className="form-control"
                placeholder="Message"
                id="floatingMessage"
                style={{ height: "150px" }}
              ></textarea>
              <label htmlFor="floatingMessage">Message</label>
            </div>
          </div>

          <div className="text-center">
            <button type="submit" className="btn submit-btn">
              Submit
            </button>
          </div>
        </form>

        <div className="row justify-content-center mt-2">
          <div className="col-sm-12 col-md-4">
            <div className="info-card">Phone Number*</div>
          </div>
          <div className="col-sm-12 col-md-4">
            <div className="info-card">Email address*</div>
          </div>
          <div className="col-sm-12 col-md-4">
            <div className="info-card">Business Hour*</div>
          </div>
        </div>

        <iframe
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3861.666613677575!2d121.04548157433027!3d14.561047678045377!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3397c858f512a25b%3A0x6be03b95b8998809!2s8296%20Dapitan%2C%20Makati%2C%201212%20Kalakhang%20Maynila!5e0!3m2!1sen!2sph!4v1750421780285!5m2!1sen!2sph"
          style={{ border: 0, height: "400px", width: "100%" }}
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        ></iframe>
      </div>

      <footer className="gray-rectangle">
        <div>
          <p>Contacts*</p>
          <p>Social Media links*</p>
        </div>
      </footer>
    </>
  );
}

export default Home;

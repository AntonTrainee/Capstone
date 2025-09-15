import Navbar from "../components/navbar";

function Services() {
  return (
    <>
      <Navbar />

      <h1
        className="text-center mb-5"
        style={{ fontSize: "2.5rem", textDecoration: "underline" }}
      >
        Our Services
      </h1>

      {/* Carousel */}
      <section className="services-carousel-section">
        <div
          id="carouselExampleIndicators"
          className="carousel slide"
          data-bs-ride="carousel"
        >
          {/* Indicators */}
          <div className="carousel-indicators">
            <button
              type="button"
              data-bs-target="#carouselExampleIndicators"
              data-bs-slide-to="0"
              className="active"
              aria-current="true"
              aria-label="Slide 1"
            ></button>
            <button
              type="button"
              data-bs-target="#carouselExampleIndicators"
              data-bs-slide-to="1"
              aria-label="Slide 2"
            ></button>
            <button
              type="button"
              data-bs-target="#carouselExampleIndicators"
              data-bs-slide-to="2"
              aria-label="Slide 3"
            ></button>
          </div>

          {/* Carousel Items */}
          <div className="carousel-inner">
            {/* First Slide */}
            <div className="carousel-item active">
              <div className="d-flex justify-content-center">
                <div className="service-card">
                  <div className="d-flex gap-3">
                    <div className="service-img-placeholder"></div>
                    <div>
                      <h5>Details:</h5>
                      <p>
                        BALABAAAALBAALAKABLALABABBLBALBALBALBABBLABALBALABL
                        BALBALBALABLABALBALBALBALBALBALABABlala blablblalbal.
                      </p>
                      <p className="fw-bold mt-3">General Cleaning</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Second Slide */}
            <div className="carousel-item">
              <div className="d-flex justify-content-center">
                <div className="service-card">
                  <div className="d-flex gap-3">
                    <div className="service-img-placeholder"></div>
                    <div>
                      <h5>Details:</h5>
                      <p>Deep Cleaning details here...</p>
                      <p className="fw-bold mt-3">Deep Cleaning</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Third Slide */}
            <div className="carousel-item">
              <div className="d-flex justify-content-center">
                <div className="service-card">
                  <div className="d-flex gap-3">
                    <div className="service-img-placeholder"></div>
                    <div>
                      <h5>Details:</h5>
                      <p>Window Cleaning details here...</p>
                      <p className="fw-bold mt-3">Window Cleaning</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Prev/Next Arrows */}
          <button
            className="carousel-control-prev"
            type="button"
            data-bs-target="#carouselExampleIndicators"
            data-bs-slide="prev"
          >
            <span className="carousel-control-prev-icon" aria-hidden="true"></span>
            <span className="visually-hidden">Previous</span>
          </button>
          <button
            className="carousel-control-next"
            type="button"
            data-bs-target="#carouselExampleIndicators"
            data-bs-slide="next"
          >
            <span className="carousel-control-next-icon" aria-hidden="true"></span>
            <span className="visually-hidden">Next</span>
          </button>
        </div>
      </section>

      <footer
        className="gray-rectangle"
        style={{
          position: "fixed",
          bottom: 0,
          width: "100%",
        }}
      >
        <div>
          <p>Contacts*</p>
          <p>Social Media links*</p>
        </div>
      </footer>
    </>
  );
}

export default Services;

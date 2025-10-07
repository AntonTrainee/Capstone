import Navbar from "../components/navbar";
import pasta from "../assets/pasta.jpg";
import sheclean from "../assets/ohshecleaning.jpg";
import eng from "../assets/engine.jpg";
import Footer from "../components/footer";

function AboutUs() {
  return (
    <>
      <Navbar />

      <main className="main-content-container">
        <div className="about-container">
          <h1 className="section-title about-title text-center">About Us</h1>
          <div className="divider" />

          <div className="about-flex">
            <div className="about-text">
              <div className="about-block">
                <h2 className="what">What we are</h2>
                <p>
                  <span className="bold">GenClean Inc.</span> is a reputable and
                  reliable property maintenance contractor established in January
                  2024. What began as a small freelance general cleaning service
                  quickly grew into a trusted company, now based at Unit 114, 2nd
                  Floor, Corinthian Executive Regency, Ortigas Ave., San Antonio,
                  Pasig City.
                </p>
              </div>

              <div className="about-block">
                <h2 className="what">What we do</h2>
                <p>
                  We specialize in delivering comprehensive property maintenance
                  solutions for homeowners, property managers, and businesses.
                  With a workforce of 44 skilled employees, including licensed
                  contractors, certified technicians, and dedicated janitorial
                  staff, we bring a strong commitment to excellence, attention to
                  detail, and reliable service in every project.
                </p>
              </div>
            </div>

            <div className="about-images">
              <div className="big-rect">
                <img
                  src={sheclean}
                  alt="Cleaning service"
                />
              </div>
              <div className="small-images">
                <div className="small-rect">
                  <img
                    src={pasta}
                    alt="Broom and cleaning tools"
                  />
                </div>
                <div className="small-rect">
                  <img
                    src={eng}
                    alt="Maintenance engineer"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <section className="why-choose">
        <div className="why-content">
          <h2 className="why-title">Why Choose GenClean?</h2>
          <div className="why-text">
            <p>
              <span className="bold">Client-First Service</span> — Open,
              transparent, and reliable. We tailor solutions to fit your exact
              needs.
            </p>
            <p>
              <span className="bold">Expert Team</span> — Licensed contractors,
              certified technicians, and trained staff who constantly upgrade
              their skills.
            </p>
            <p>
              <span className="bold">Unmatched Quality</span> — Every project is
              done with precision, care, and the highest industry standards.
            </p>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}

export default AboutUs;

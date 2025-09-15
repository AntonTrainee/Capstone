import Navbar from "../components/navbar";

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
                <h2>What we are</h2>
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
                <h2>What we do</h2>
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
              <div className="gray-rectangle big-rect">Big Image</div>
              <div className="small-images">
                <div className="gray-rectangle small-rect">Small 1</div>
                <div className="gray-rectangle small-rect">Small 2</div>
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
              <span className="bold">Unmatched Quality </span> — Every project is done with precision, care, 
              and the highest industry standards.
            </p>
          </div>
        </div>
      </section>
      
      <section className="contact-section">
        <div className="contactcontainer">
          <h2 className="contact-title">Contact Us</h2>

          <div className="contact-grid">
            <div>
              <p>
                <span className="bold">Email:</span> inquiries@genclean.com.ph
              </p>
              <p className="bold">Phone Numbers:</p>
              <div className="phone-grid">
                <ul>
                  <li>82546323</li>
                  <li>277385555</li>
                </ul>
                <ul>
                  <li>09260193470</li>
                  <li>09543174179</li>
                </ul>
              </div>
            </div>
            <div>
              <p className="bold">Address:</p>
              <p>
                Unit 114, 2nd Floor, Corinthian Executive Regency,
                <br />
                Ortigas Ave., San Antonio, Pasig City
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export default AboutUs;
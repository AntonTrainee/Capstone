import { useState } from "react";
import Navbar from "../components/navbar";
import genmain from "../assets/general-maintenance.jpg";
import janitor from "../assets/janitorial-services-1536x1024.jpg";
import pest from "../assets/pest-control-UT-hybridpestcontrol-scaled-2560x1280.jpeg";

function Services() {
  const services = [
    {
      title: "General Maintenance",
      details:
        "We handle routine repairs, upkeep, and maintenance tasks to keep your property in top condition.",
      image: genmain,
    },
    {
      title: "Janitorial and Cleaning Services",
      details:
        "Comprehensive cleaning services including offices, buildings, and commercial spaces to maintain hygiene and presentation.",
      image: janitor,
    },
    {
      title: "Pest Control",
      details:
        "Effective and safe pest management solutions to protect your property from unwanted infestations.",
      image: pest,
    },
  ];

  const [selectedService, setSelectedService] = useState(services[0]);

  return (
    <>
      <Navbar />

      <h1
        className="text-center my-5"
        style={{ fontSize: "2.5rem", textDecoration: "underline",  }}
      >
        Our Services
      </h1>

      <div className="services-page container services-container">
        <div
          className="p-3 services-sidebar"
          style={{
            width: "220px",
            backgroundColor: "#2294B5",
            borderRadius: "6px",
            height: "fit-content",
          }}
        >
          <h5 className="text-white mb-3">Services</h5>
          <ul className="list-unstyled">
            {services.map((service, index) => (
              <li
                key={index}
                onClick={() => setSelectedService(service)}
                className={`p-2 mb-2 rounded ${
                  selectedService.title === service.title
                    ? "bg-dark text-white"
                    : "bg-light text-dark"
                }`}
                style={{ cursor: "pointer" }}
              >
                {service.title}
              </li>
            ))}
          </ul>
        </div>

        <div
          className="p-4 ms-4 services-details"
          style={{
            flex: 1,
            backgroundColor: "#13294B",
            borderRadius: "12px",
            color: "white",
          }}
        >
          <div className="d-flex gap-4">
            {/* Image box */}
            <div
              style={{
                width: "200px",
                height: "200px",
                borderRadius: "10px",
                overflow: "hidden",
              }}
            >
              <img
                src={selectedService.image}
                alt={selectedService.title}
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
            </div>

            {/* Text details */}
            <div>
              <h3>{selectedService.title}</h3>
              <h5>Details:</h5>
              <p>{selectedService.details}</p>
            </div>
          </div>
        </div>
      </div>

      <section className="contact-section" style={{marginTop:"220px"}}>
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

export default Services;

import { useState } from "react";
import Navbar from "../components/navbar";
import genmain from "../assets/general-maintenance.jpg";
import janitor from "../assets/janitorial-services-1536x1024.jpg";
import pest from "../assets/pest-control-UT-hybridpestcontrol-scaled-2560x1280.jpeg";
import Footer from "../components/footer";

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

      {/* Heading + Divider */}
      <div className="services-header text-center my-5">
        <h1 className="section-title about-title text-center">Our Services</h1>
        <div
          className="divider"
          style={{
            width: "100px",
            height: "3px",
            margin: "0 auto",
          }}
        />
      </div>

      <div className="services-page container services-container d-flex gap-4 flex-wrap">
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

        {/* Details */}
        <div
          className="p-4 services-details flex-grow-1"
          style={{
            backgroundColor: "#13294B",
            borderRadius: "12px",
            color: "white",
            flex: "1",
            minWidth: "300px",
            marginBottom: "100px",
          }}
        >
          <div
            className="d-flex gap-4 align-items-center flex-nowrap flex-md-nowrap flex-sm-wrap"
            style={{ flexWrap: "nowrap" }}
          >
            {/* Image */}
            <div
              style={{
                width: "220px",
                height: "220px",
                borderRadius: "10px",
                overflow: "hidden",
                flexShrink: 0,
              }}
            >
              <img
                src={selectedService.image}
                alt={selectedService.title}
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                }}
              />
            </div>

            {/* Text */}
            <div style={{ flex: 1 }}>
              <h3>{selectedService.title}</h3>
              <h5>Details:</h5>
              <p>{selectedService.details}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Contact Section */}
      <Footer />
    </>
  );
}

export default Services;

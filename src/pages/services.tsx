import { useState } from "react";
import Navbar from "../components/navbar";

function Services() {
  // Service data
  const services = [
    {
      title: "General Maintenance",
      details:
        "We handle routine repairs, upkeep, and maintenance tasks to keep your property in top condition.",
    },
    {
      title: "Janitorial and Cleaning Services",
      details:
        "Comprehensive cleaning services including offices, buildings, and commercial spaces to maintain hygiene and presentation.",
    },
    {
      title: "Pest Control",
      details:
        "Effective and safe pest management solutions to protect your property from unwanted infestations.",
    },
  ];

  // Track which service is selected
  const [selectedService, setSelectedService] = useState(services[0]);

  return (
    <>
      <Navbar />

      {/* Page Title */}
      <h1
        className="text-center my-5"
        style={{ fontSize: "2.5rem", textDecoration: "underline" }}
      >
        Our Services
      </h1>

      {/* Layout Section */}
      <div className="container d-flex">
        {/* Sidebar */}
        <div
          className="p-3"
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

        {/* Service Card */}
        <div
          className="p-4 ms-4"
          style={{
            flex: 1,
            backgroundColor: "#13294B",
            borderRadius: "12px",
            color: "white",
          }}
        >
          <div className="d-flex gap-4">
            {/* Image Placeholder */}
            <div
              style={{
                width: "200px",
                height: "200px",
                backgroundColor: "#ccc",
                borderRadius: "10px",
              }}
            ></div>

            {/* Service Info */}
            <div>
              <h3>{selectedService.title}</h3>
              <h5>Details:</h5>
              <p>{selectedService.details}</p>
            </div>
          </div>
        </div>
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

export default Services;

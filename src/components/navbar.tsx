import { Link, useLocation } from "react-router-dom";
import { useEffect } from "react";

function Navbar() {
  const location = useLocation();

  useEffect(() => {
    if (location.hash) {
      
      const id = location.hash.replace("#", "");
      const el = document.getElementById(id);
      if (el) {
        setTimeout(() => {
          el.scrollIntoView({ behavior: "smooth" });
        }, 100);
      }
    } else if (location.pathname === "/") {
     
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [location]);

  return (
    <nav className="navbar navbar-expand-lg my-navbar sticky-top">
      <div className="container-fluid">
        <Link className="navbar-brand" to="/">
          GenClean
        </Link>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarSupportedContent"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div
          className="collapse navbar-collapse justify-content-end"
          id="navbarSupportedContent"
        >
          <ul className="navbar-nav mb-2 mb-lg-0">
           
            <li className="nav-item">
              <Link className="nav-link d-flex align-items-center gap-2" to="/">
                <i className="bi bi-house-fill"></i>
                Home
              </Link>
            </li>

            
            <li className="nav-item">
              <Link
                to="/services"
                className="btn btn-link nav-link d-flex align-items-center gap-2"
              >
                <i className="bi bi-border-width"></i>
                Services
              </Link>
            </li>

           
            <li className="nav-item">
              <Link
                to="/#contact"
                className="btn btn-link nav-link d-flex align-items-center gap-2"
              >
                <i className="bi bi-telephone-fill"></i>
                Contact Us
              </Link>
            </li>

            
            <li className="nav-item">
              <Link
                to="/aboutus"
                className="btn btn-link nav-link d-flex align-items-center gap-2"
              >
                <i className="bi bi-award-fill"></i>
                About Us
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;

export default function Footer() {
  return (
    <footer>
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
            <p>© 2025 GenClean. All rights reserved. 
                <a href="/privacy-notice"> Privacy Notice</a> | 
                <a href="/cookies"> Cookies</a>
            </p>
          </div>
        </div>
      </section>
    </footer>

   
  );
}

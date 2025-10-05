import Footer from "../components/footer";

export default function Cookies() {
  return (
    <div style={{ padding: "2rem", maxWidth: "800px", margin: "0 auto" }}>
      <h1>Cookies Policy</h1>
      <p>Effective date: [INSERT DATE]</p>

      <h2>1. What are cookies?</h2>
      <p>
        Cookies are small text files that a website stores on your computer or
        mobile device when you visit. They help the site remember your actions
        and preferences (like login, language, or dark mode), so you don’t have
        to set them up again every time you return.
      </p>

      <h2>2. How we use cookies</h2>
      <p>
        GenClean uses cookies to improve your experience and ensure our website
        works correctly. Specifically, we use cookies to:
      </p>
      <ul>
        <li>Keep you signed in during your session.</li>
        <li>Remember your preferences (language, theme).</li>
        <li>Analyze site traffic and performance.</li>
        <li>Support secure transactions and fraud prevention.</li>
        <li>
          If applicable, personalize marketing content based on your interests
          (with your consent).
        </li>
      </ul>

      <h2>3. Types of cookies we use</h2>
      <ul>
        <li>
          <strong>Essential cookies</strong> – Required for the site to function
          (e.g., login, booking forms).
        </li>
        <li>
          <strong>Performance & analytics cookies</strong> – Help us understand
          how the site is used and improve user experience.
        </li>
        <li>
          <strong>Functional cookies</strong> – Remember your choices like
          language, location, or settings.
        </li>
        <li>
          <strong>Advertising cookies</strong> – May be used to deliver relevant
          ads, only if you’ve accepted them.
        </li>
      </ul>

      <h2>4. Managing cookies</h2>
      <p>
        Most browsers let you control or delete cookies in their settings. You
        can usually block certain cookies or set your browser to warn you before
        saving them. Please note that disabling essential cookies may affect
        website functionality.
      </p>

      <h2>5. Updates to this policy</h2>
      <p>
        We may update this Cookies Policy from time to time. Any changes will be
        posted on this page with a new “Effective date.”
      </p>

      <h2>6. Contact us</h2>
      <p>
        If you have questions about our use of cookies, please contact us at:{" "}
        <a href="mailto:privacy@yourdomain.com">privacy@yourdomain.com</a>
      </p>

      <Footer />
    </div>
  );
}


import Footer from "../components/footer";

export default function PrivacyNotice() {
  return (
    <div style={{ padding: "2rem", maxWidth: "800px", margin: "0 auto" }}>
      <h1>Privacy Notice</h1>
      <p>Effective date: October 13, 2025</p>

      <h2>1. Introduction</h2>
      <p>
        GenClean (“we”, “our”, or “us”) respects your privacy. This Privacy Notice
        explains what personal data we collect, why we collect it, how long we
        keep it, who we share it with, and your rights regarding that data.
      </p>

      <h2>2. Who we are</h2>
      <p>
        <strong>Controller:</strong> GenClean <br />
        <strong>Contact (Data Protection Officer):</strong> Rjay Ortiz <br />
        <strong>Email:</strong> dataprotection@genclean.com.ph <br />
        <strong>Address:</strong> Unit 114, Corinthian Executive Regency, No.7
        Ortigas Ave, Ortigas Center, Brgy. San Antonio, Pasig City
      </p>

      <h2>3. Data we collect (examples)</h2>
      <ul>
        <li>Account and identity data: name, email, phone, username.</li>
        <li>
          Booking & service details: booking date/time, service address, cleaner
          assigned, photos of service results.
        </li>
        <li>
          Payment & billing data: invoices, transaction IDs. (We do not store full
          card numbers — we use tokenized payment processors wherever possible.)
        </li>
        <li>Support & communications: chat logs, support tickets, emails.</li>
        <li>
          Device & usage data: IP address, device type, browser, cookies and
          analytics identifiers.
        </li>
        <li>CCTV / photos (if applicable): before/after photos or on-site images.</li>
      </ul>

      <h2>4. Why we collect it (purposes)</h2>
      <p>
        We process personal data to:
      </p>
      <ul>
        <li>provide and improve services,</li>
        <li>process and record payments,</li>
        <li>communicate with customers,</li>
        <li>meet legal and tax obligations,</li>
        <li>detect and prevent fraud, and</li>
        <li>conduct marketing where you’ve consented.</li>
      </ul>

      <h2>5. Legal bases (Philippines)</h2>
      <p>
        We rely on legitimate business purposes, contractual necessity, consent
        (where applicable), and compliance with legal obligations.
      </p>

      <h2>6. Data retention — how long we keep data</h2>
      <ul>
        <li>
          <strong>Account/profile data:</strong> kept while your account is active.
          After account deletion or inactivity, retained for 30 days for dispute
          resolution and fraud prevention, then deleted or anonymized.
        </li>
        <li>
          <strong>Booking records & service details:</strong> kept for 2 years for
          accounting/tax compliance and disputes.
        </li>
        <li>
          <strong>Payment & invoicing records:</strong> kept for 2 years for
          tax/accounting rules.
        </li>
        <li>
          <strong>Support tickets & communications:</strong> kept for 2 years from
          last contact.
        </li>
        <li>
          <strong>Marketing consents:</strong> kept until withdrawn, or removed
          after 2 years of inactivity.
        </li>
        <li>
          <strong>Analytics logs:</strong> raw logs kept for 12 months, anonymized
          data may be kept indefinitely.
        </li>
        <li>
          <strong>Security logs:</strong> up to 24 months.
        </li>
        <li>
          <strong>Backups:</strong> up to 90 days unless held longer for legal
          reasons.
        </li>
        <li>
          <strong>CCTV/photos:</strong> up to 2 years unless needed longer.
        </li>
      </ul>

      <h2>7. Your rights</h2>
      <p>
        You can request access, correction, deletion, restriction, portability, or
        object to processing. Contact us at
        <strong> dataprotection@genclean.com.ph</strong>. We will respond within
        legally required timeframes.
      </p>

      <h2>8. Sharing data</h2>
      <p>
        We may share data with payment processors, service providers (hosting,
        analytics), and law enforcement if required by law.
      </p>

      <h2>9. Security</h2>
      <p>
        We use encryption, access controls, and monitoring. In case of a breach,
        we will follow legal obligations and notify affected users as required.
      </p>

      <h2>10. Cookies & tracking</h2>
      <p>
        We use cookies for site functionality and analytics. Marketing cookies are
        only set with your consent.
      </p>

      <h2>11. Changes</h2>
      <p>
        We may update this Privacy Notice. If changes are material, we will notify
        you via the site or email.
      </p>

      <h2>12. Contact & complaints</h2>
      <p>
        <strong>Data Protection Officer:</strong> Rjay Ortiz <br />
        <strong>Email:</strong> dataprotection@genclean.com.ph <br />
        <strong>Address:</strong> Unit 114, Corinthian Executive Regency, No.7
        Ortigas Ave, Ortigas Center, Brgy. San Antonio, Pasig City <br />
        You can also contact the National Privacy Commission if your rights are
        violated.
      </p>

      <Footer />
    </div>
  );
}

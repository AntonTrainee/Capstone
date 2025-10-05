import Footer from "../components/footer";

export default function PrivacyNotice() {
  return (
    <div style={{ padding: "2rem", maxWidth: "800px", margin: "0 auto" }}>
      <h1>Privacy Notice</h1>
      <p>Effective date: [INSERT DATE]</p>

      <h2>1. Introduction</h2>
      <p>
        GenClean (“we”, “our”, or “us”) respects your privacy. This Privacy
        Notice explains what personal data we collect, why we collect it, how
        long we keep it, who we share it with, and your rights regarding that
        data.
      </p>

      <h2>2. Who we are</h2>
      <p>
        Controller: [Insert legal entity name] <br />
        Contact (Data Protection Officer or privacy contact): [DPO name or
        privacy@yourdomain.com] <br />
        Address: [Insert address]
      </p>

      <h2>3. Data we collect (examples)</h2>
      <ul>
        <li>Account and identity data: name, email, phone, username.</li>
        <li>
          Booking & service details: booking date/time, service address, cleaner
          assigned, photos of service results.
        </li>
        <li>
          Payment & billing data: invoices, transaction IDs. (We do not store
          full card numbers — we use tokenized payment processors wherever
          possible.)
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
        We process personal data to: provide and improve services, process and
        record payments, communicate with customers, meet legal and tax
        obligations, detect and prevent fraud, and for marketing where you’ve
        consented.
      </p>

      <h2>5. Legal bases (Philippines)</h2>
      <p>
        We rely on legitimate business purposes, contractual necessity, consent
        (where applicable), and compliance with legal obligations.
      </p>

      <h2>6. Data retention — how long we keep data</h2>
      <ul>
        <li>
          <strong>Account/profile data</strong>: kept while your account is
          active. After account deletion or inactivity, retained for <strong>2 years</strong> for
          dispute resolution and fraud prevention, then deleted or anonymized.
        </li>
        <li>
          <strong>Booking records & service details</strong>: kept for{" "}
          <strong>10 years</strong> for accounting/tax compliance and disputes.
        </li>
        <li>
          <strong>Payment & invoicing records</strong>: kept for{" "}
          <strong>10 years</strong> for tax/accounting rules.
        </li>
        <li>
          <strong>Support tickets & communications</strong>: kept for{" "}
          <strong>3 years</strong> from last contact.
        </li>
        <li>
          <strong>Marketing consents</strong>: kept until withdrawn, or removed
          after <strong>3 years</strong> of inactivity.
        </li>
        <li>
          <strong>Analytics logs</strong>: raw logs kept for{" "}
          <strong>12 months</strong>, anonymized data may be kept indefinitely.
        </li>
        <li>
          <strong>Security logs</strong>: up to <strong>24 months</strong>.
        </li>
        <li>
          <strong>Backups</strong>: up to <strong>90 days</strong> unless held
          longer for legal reasons.
        </li>
        <li>
          <strong>CCTV/photos</strong>: up to <strong>3 years</strong> unless
          needed longer.
        </li>
      </ul>

      <p>
        We may keep data longer if required to establish, exercise, or defend
        legal claims. When no longer needed, data is securely deleted or
        anonymized.
      </p>

      <h2>7. Your rights</h2>
      <p>
        You can request access, correction, deletion, restriction, portability,
        or object to processing. Contact us at privacy@yourdomain.com. We will
        respond within legally required timeframes.
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
        We use cookies for site functionality and analytics. Marketing cookies
        are only set with your consent.
      </p>

      <h2>11. Changes</h2>
      <p>
        We may update this Privacy Notice. If changes are material, we will
        notify you via the site or email.
      </p>

      <h2>12. Contact & complaints</h2>
      <p>
        Contact us at [DPO name] / privacy@yourdomain.com / [phone]. You can
        also contact the National Privacy Commission if your rights are
        violated.
      </p>

      <Footer />
    </div>
  );
}

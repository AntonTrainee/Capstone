import { useState, useEffect } from "react";

export default function CookieBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem("cookieConsent");
    if (!consent) {
      setVisible(true);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem("cookieConsent", "true");
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div
      style={{
        position: "fixed",
        bottom: 0,
        width: "100%",
        background: "#333",
        color: "#fff",
        padding: "1rem",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        fontSize: "0.9rem",
        zIndex: 1000,
      }}
    >
      <span>
        We use cookies to improve your experience. By continuing, you agree to
        our{" "}
        <a
          href="/cookies"
          style={{ color: "#4da6ff", textDecoration: "underline" }}
        >
          Cookies Policy
        </a>
        .
      </span>
      <button
        onClick={handleAccept}
        style={{
          marginLeft: "1rem",
          background: "#4da6ff",
          border: "none",
          color: "#fff",
          padding: "0.5rem 1rem",
          cursor: "pointer",
          borderRadius: "5px",
        }}
      >
        Accept
      </button>
    </div>
  );
}


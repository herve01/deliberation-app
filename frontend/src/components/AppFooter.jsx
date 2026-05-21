import React from "react";
import "@src/styles/app-style.css";

const AppFooter = () => {
  return (
    <footer
      className="w-100 d-flex align-items-center justify-content-center px-4"
      style={{
        height: 60,
        background:
          "linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #334155 100%)",
        borderTop:
          "1px solid rgba(255,255,255,0.08)",
      }}
    >

      <div className="text-center">

        <p
          className="mb-0 text-white"
          style={{
            fontSize: 14,
            fontWeight: 500,
            letterSpacing: 0.3,
          }}
        >
          © 2026 DélibérationApp
        </p>

        <small
          className="text-white-50"
          style={{
            fontSize: 12,
          }}
        >
          Plateforme de gestion académique • Powered by H.K
        </small>

      </div>

    </footer>
  );
};

export default AppFooter;
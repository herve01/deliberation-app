import React, { useState, useRef, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "@src/AuthContext";

const AppHeader = () => {
  const { user, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const dropdownRef = useRef(null);

  const pathnames = location.pathname.split("/").filter((x) => x);

  const labels = {
    dashboard: "Dashboard",
    membres: "Membres",
    liste: "Liste",
  };

  // Fermer si clic en dehors
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Fermer lors du changement de page
  useEffect(() => {
    setOpen(false);
  }, [location.pathname]);

  return (
    <header
      className="d-flex justify-content-between align-items-center px-3"
      style={{
        height: "60px",
        background: "#fff",
        borderBottom: "1px solid #ddd",
      }}
    >
      {/* LEFT */}
      <div className="d-flex align-items-center gap-3">
        <button
          onClick={() => console.log("toggle sidebar")}
          style={{ border: "none", background: "transparent", fontSize: "20px" }}
        >
          ☰
        </button>

        <div>
          <Link to="/" style={{ textDecoration: "underline" }}>
            Home
          </Link>

          {pathnames.map((value, index) => {
            const to = "/" + pathnames.slice(0, index + 1).join("/");
            const label =
              labels[value] ||
              value.charAt(0).toUpperCase() + value.slice(1);

            return (
              <span key={to}>
                {" / "}
                {index === pathnames.length - 1 ? (
                  <span className="text-muted">{label}</span>
                ) : (
                  <Link to={to} style={{ textDecoration: "underline" }}>
                    {label}
                  </Link>
                )}
              </span>
            );
          })}
        </div>
      </div>

      {/* RIGHT */}
      <div ref={dropdownRef} style={{ position: "relative" }}>
        {/* bouton au lieu de div */}
        <button
          onClick={() => setOpen((prev) => !prev)}
          style={{
            border: "none",
            background: "transparent",
            cursor: "pointer",
            marginRight: "20px",
          }}>
          <i className="bi bi-person" style={{ fontSize: "25px" }}></i>
        </button>

        {/* DROPDOWN */}
        {open && (
          <div
            style={{
              position: "absolute",
              right: "20px",
              top: "40px",
              width: "250px",
              background: "#fff",
              border: "1px solid #ddd",
              borderRadius: "5px",
              boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
              zIndex: 1000,
            }}
          >
            <div
              className="p-2 border-bottom"
              style={{ background: "#f5f5f5", color: "#6c757d" }}>
              {user?.nom || "sysadmin"}
            </div>

            {/* fermeture au clic */}
            <div
              className="p-2 dropdown-item custom-item"
              onClick={() => setOpen(false)}
              style={{ cursor: "pointer", display: "flex", gap: "10px" }}>
              <i className="bi bi-person"></i>
              Profile
            </div>

            <div
              className="p-2 dropdown-item custom-item"
              onClick={() => setOpen(false)}
              style={{ cursor: "pointer", display: "flex", gap: "10px" }}>
              <i className="bi bi-key"></i>
              Modifier le mot de passe
            </div>

            <div
              className="p-2 text-danger custom-item"
              onClick={() => {
                setOpen(false);
                logout();
              }}
              style={{
                cursor: "pointer",
                display: "flex",
                gap: "10px",
                borderTop: "1px solid #ddd",
              }}>
              <i className="bi bi-box-arrow-right"></i>
              Se déconnecter
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default AppHeader;
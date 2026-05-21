import React from "react";

import AppSidebarNav from "@src/components/AppSidebarNav";
import navigation from "@src/core/navigation/_nav";

const AppSidebar = () => {
  return (
    <aside
      className="d-flex flex-column text-white shadow-lg"
      style={{
        width: "260px",
        minHeight: "100vh",
        background:
          "linear-gradient(180deg, #0f172a 0%, #1e293b 50%, #334155 100%)",
        borderRight:
          "1px solid rgba(255,255,255,0.08)",
      }}
    >

      {/* LOGO */}
      <div
        className="d-flex flex-column align-items-center justify-content-center py-4"
        style={{
          borderBottom:
            "1px solid rgba(255,255,255,0.08)",
        }}
      >

        {/* ICON */}
        <div
          className="d-flex align-items-center justify-content-center shadow"
          style={{
            width: 74,
            height: 74,
            borderRadius: "22px",
            background:
              "linear-gradient(135deg, #2563eb 0%, #3b82f6 100%)",
          }}
        >
          <i className="bi bi-mortarboard-fill fs-2 text-white"></i>
        </div>

        {/* TITLE */}
        <div className="mt-3 text-center">

          <div
            className="fw-bold text-white"
            style={{
              fontSize: 18,
              letterSpacing: 0.5,
            }}
          >
            Gestion Académique
          </div>

          <small
            className="text-white-50"
            style={{
              fontSize: 12,
            }}
          >
            Administration système
          </small>

        </div>

      </div>

      {/* NAVIGATION */}
      <div
        className="flex-grow-1 overflow-auto py-3"
        style={{
          scrollbarWidth: "thin",
        }}
      >
        <nav className="nav flex-column px-2">
          <AppSidebarNav items={navigation} />
        </nav>
      </div>

    </aside>
  );
};

export default AppSidebar;
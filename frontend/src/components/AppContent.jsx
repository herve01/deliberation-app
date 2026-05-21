import React from "react";
import { Outlet } from "react-router-dom";
import "@src/styles/app-style.css";

const AppContent = () => {
  return (
    <main
      className="flex-grow-1 overflow-auto"
      style={{
        minHeight: "100vh",
        padding: "24px",
        background:
          "linear-gradient(180deg, #f8fafc 0%, #eef2f7 100%)",
      }}
    >

      {/* PAGE CONTENT */}
      <div
        className="mx-auto"
        style={{
          width: "100%",
          animation:
            "fadeIn 0.25s ease-in-out",
        }}
      >
        <Outlet />
      </div>

    </main>
  );
};

export default AppContent;
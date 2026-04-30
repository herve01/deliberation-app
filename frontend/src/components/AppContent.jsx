import React from "react";
import { Outlet } from "react-router-dom";
import "../styles/app-style.css";

const AppContent = () => {
  return (
    <main className="content">
      <Outlet />
    </main>
  );
};

export default AppContent;
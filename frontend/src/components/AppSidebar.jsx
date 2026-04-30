import React from "react";
import AppSidebarNav from "@src/components/AppSidebarNav";
import navigation from "@src/_nav";

const AppSidebar = () => {
  return (
    <aside
      className="bg-dark text-white d-flex flex-column p-3"
      style={{ width: "240px" }}>

      <div className="d-flex flex-column align-items-center mb-4">
        <div
          className="d-flex align-items-center justify-content-center bg-primary"
          style={{
            width: 70,
            height: 70,
            borderRadius: "50%",
          }}>
          <i className="bi bi-journal-bookmark-fill fs-4"></i>
        </div>
      </div>

    <nav className="nav flex-column">
        <AppSidebarNav items={navigation} />
    </nav>
    </aside>
  );
};

export default AppSidebar;
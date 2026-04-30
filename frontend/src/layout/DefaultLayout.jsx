import React from "react";
import AppSidebar from "@src/components/AppSidebar";
import AppHeader from "@src/components/AppHeader";
import AppFooter from "@src/components/AppFooter";
import AppContent from "@src/components/AppContent";

const DefaultLayout = () => {
  return (
    <div className="d-flex vh-100 overflow-hidden">

      {/* Sidebar */}
      <AppSidebar />

      {/* Main content */}
      <div className="wrapper d-flex flex-column flex-grow-1 bg-light">

        <AppHeader />

        <div className="body flex-grow-1 overflow-auto d-flex flex-column">

            {/* Contenu */}
            <div className="px-3">
                <AppContent />
            </div>

            {/* Footer toujours en bas */}
            <div className="mt-auto">
                <AppFooter />
            </div>

        </div>
      </div>
    </div>
  )
}

export default DefaultLayout;
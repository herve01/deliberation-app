import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { AuthProvider } from "@src/app/context/AuthContext";
import 'bootstrap/dist/css/bootstrap.min.css'
import "bootstrap-icons/font/bootstrap-icons.css";

import "@src/styles/sidebar.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AuthProvider>
      <App />
    </AuthProvider>
  </React.StrictMode>
);
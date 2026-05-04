import React, { Component, Suspense } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ToastProvider } from "@src/app/context/ToastContext";

import routes from "@src/app/routes";
import PrivateRoute from "@src/app/PrivateRoute";
import DefaultLayout from "@src/layout/DefaultLayout";
import { useAuth } from "@src/app/context/AuthContext";

// Pages
const Login = React.lazy(() => import('./views/modules/pages/Login'))

function App() {
  const { user } = useAuth();

  return (

    <ToastProvider>
        <BrowserRouter>
          <Suspense fallback={<div>Loading...</div>}>
            <Routes>

              {/* Route dynamique */}
              <Route
                path="/"
                element={
                  user ? <Navigate to="/login" /> : <Navigate to="/login" />
                }
              />

              {/* Route publique */}
              <Route path="/login" name="Login Page" element={<Login />} />

              {/* Routes protégées avec layout */}
              <Route
                path="/"
                element={
                  <PrivateRoute>
                    <DefaultLayout />
                  </PrivateRoute>
                }
                >
                {routes.map((route, index) => (
                  <Route
                    key={index}
                    path={route.path}
                    element={route.element}
                  />
                ))}
              </Route>
            </Routes>
          </Suspense>
        </BrowserRouter>
    </ToastProvider>
  );
}

export default App;
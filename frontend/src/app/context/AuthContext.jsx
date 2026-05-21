import React, { createContext, useContext, useState, useEffect } from "react";

import loginService from "@src/infrastructure/services/setting/loginService";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // true au début

  // Charger user depuis localStorage au démarrage
  useEffect(() => {
    try {
      const storedUser = localStorage.getItem("user");

      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    } catch (e) {
      console.error("Erreur parsing user:", e);
      localStorage.removeItem("user"); // nettoyage si corrompu
    } finally {
      setLoading(false); // fin chargement
    }
  }, []);

  // login async
  const login = async (username, password) => {
    setLoading(true);

    try {
      const data = await loginService.login({
        username: username,
        passwd: password,
      });

      if (!data) return false;

      const userData = {
        name: username || "Admin",
        role: data.role || "USER",
      };

      // update state + stockage
      setUser(userData);
      localStorage.setItem("user", JSON.stringify(userData));

      return true;
    } catch (error) {
      console.error("Erreur login:", error);
      return false;
    } finally {
      setLoading(false);
    }
  };

  // logout propre
  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook sécurisé
export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth doit être utilisé dans AuthProvider");
  }

  return context;
};
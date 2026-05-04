import { Navigate } from "react-router-dom";
import { useAuth } from "@src/app/context/AuthContext";

const PrivateRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div>Chargement...</div>; // ou spinner bootstrap
  }

  return user ? children : <Navigate to="/" replace />;
};

export default PrivateRoute;
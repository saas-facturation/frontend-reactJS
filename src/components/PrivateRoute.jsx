
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const PrivateRoute = ({ children }) => {
  const { utilisateur, chargement } = useAuth();

  // Pendant la vérification du token → ne rien afficher
  if (chargement) {
    return (
      <div style={{ display: "flex", justifyContent: "center", marginTop: "2rem" }}>
        Chargement...
      </div>
    );
  }

  // Pas connecté → rediriger vers /login
  if (!utilisateur) {
    return <Navigate to="/login" replace />;
  }

  // Connecté → afficher la page demandée
  return children;
};

export default PrivateRoute;

import { createContext, useContext, useState, useEffect } from "react";
import api from "../services/api";

// Créer le contexte
const AuthContext = createContext(null);

// Hook personnalisé pour utiliser le contexte facilement
export const useAuth = () => useContext(AuthContext);

// Provider — enveloppe toute l'application
export const AuthProvider = ({ children }) => {
  const [utilisateur, setUtilisateur] = useState(null);
  const [chargement, setChargement] = useState(true); // true au démarrage

  // Au démarrage de l'app, vérifier si un token existe déjà
  useEffect(() => {
    const verifierToken = async () => {
      const token = localStorage.getItem("token");

      if (token) {
        try {
          // Appeler /api/auth/me pour vérifier que le token est encore valide
          const response = await api.get("/api/auth/me");
          setUtilisateur(response.data); // stocker les infos utilisateur
        } catch {
          // Token invalide ou expiré → nettoyer
          localStorage.removeItem("token");
          setUtilisateur(null);
        }
      }

      setChargement(false); // chargement terminé
    };

    verifierToken();
  }, []);

  // Fonction inscription
  const inscrire = async (nom, email, password, pays) => {
    const response = await api.post("/api/auth/register", {
      nom,
      email,
      password,
      pays
    });

    localStorage.setItem("token", response.data.token);
    setUtilisateur(response.data);
    return response.data;
  };

  // Fonction connexion
  const connecter = async (email, password) => {
    const response = await api.post("/api/auth/login", { email, password });
    localStorage.setItem("token", response.data.token);
    setUtilisateur(response.data);
    return response.data;
  };

  // Fonction déconnexion
  const deconnecter = () => {
    localStorage.removeItem("token");
    setUtilisateur(null);
  };

  return (
    <AuthContext.Provider
      value={{
        utilisateur,
        chargement,
        inscrire,
        connecter,
        deconnecter,
        setUtilisateur
    }}
    >
      {children}
    </AuthContext.Provider>
  );
};

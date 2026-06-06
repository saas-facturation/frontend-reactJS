import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import api from "../services/api";

const OAuth2Callback = () => {
    const navigate = useNavigate();
    const { setUtilisateur } = useAuth();

    useEffect(() => {
        const traiterCallback = async () => {

            // 1. Récupérer le token depuis l'URL
            // URL reçue : http://localhost:5173/oauth2/callback?token=eyJ...
            const params = new URLSearchParams(window.location.search);
            const token = params.get("token");

            if (!token) {
                // Pas de token → erreur → rediriger vers login
                navigate("/login");
                return;
            }

            // 2. Stocker le token dans localStorage
            localStorage.setItem("token", token);

            try {
                // 3. Récupérer les infos de l'utilisateur
                // Axios ajoutera automatiquement le token dans le header
                const response = await api.get("/api/auth/me");

                // 4. Mettre l'utilisateur dans le contexte React
                setUtilisateur(response.data);

                // 5. Rediriger vers le dashboard
                navigate("/dashboard");

            } catch {
                // Token invalide → retour login
                localStorage.removeItem("token");
                navigate("/login");
            }
        };

        traiterCallback();
    }, []);

    // Afficher un écran de chargement pendant le traitement
    return (
        <div style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            minHeight: "100vh",
            fontSize: "14px",
            color: "#6b7280"
        }}>
            Connexion en cours...
        </div>
    );
};

export default OAuth2Callback;

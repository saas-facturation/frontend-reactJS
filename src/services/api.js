import axios from "axios";

const api = axios.create({
  baseURL: "", // Le proxy Vite redirige /api/* vers http://localhost:8090
});

// Intercepteur de requête
// Avant chaque appel API, on ajoute le token JWT dans le header
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Intercepteur de réponse
// Si Spring Boot retourne 403 → le token est expiré → déconnecter
api.interceptors.response.use(
  (response) => response, // succès → on laisse passer
  (error) => {
    if (error.response?.status === 403) {
      localStorage.removeItem("token");
      window.location.href = "/login"; // redirection forcée
    }
    return Promise.reject(error);
  }
);

export default api;

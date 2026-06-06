import Keycloak from "keycloak-js";

const keycloak = new Keycloak({
    url: "http://localhost:8080",           // URL de ton serveur Keycloak
    realm: "facturation-app",               // Nom du Realm créé
    clientId: "facturation-frontend",       // Nom du Client créé
});

export default keycloak;
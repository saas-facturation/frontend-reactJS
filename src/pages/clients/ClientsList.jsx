import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../../components/Layout";
import clientService from "../../services/clientService";

const ClientsList = () => {
  const [clients, setClients] = useState([]);
  const [chargement, setChargement] = useState(true);
  const [recherche, setRecherche] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    clientService.lister().then(setClients).catch(console.error).finally(() => setChargement(false));
  }, []);

  const supprimer = async (id) => {
    if (!window.confirm("Supprimer ce client ?")) return;
    await clientService.supprimer(id);
    setClients((prev) => prev.filter((c) => c.id !== id));
  };

  const filtres = clients.filter((c) =>
    c.nom.toLowerCase().includes(recherche.toLowerCase()) ||
    c.email?.toLowerCase().includes(recherche.toLowerCase())
  );

  const initiales = (nom) => nom?.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2) || "?";

  const couleurs = ["#6366f1", "#8b5cf6", "#ec4899", "#f59e0b", "#10b981", "#3b82f6"];
  const couleurClient = (id) => couleurs[id % couleurs.length];

  return (
    <Layout>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "28px" }}>
        <div>
          <h1 style={{ fontSize: "28px", fontWeight: "800", color: "#0f172a", letterSpacing: "-0.5px", marginBottom: "4px" }}>
            Clients
          </h1>
          <p style={{ fontSize: "14px", color: "#64748b" }}>
            {clients.length} client{clients.length !== 1 ? "s" : ""} au total
          </p>
        </div>
        <button
          onClick={() => navigate("/clients/nouveau")}
          style={{
            padding: "10px 20px", background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
            color: "#fff", border: "none", borderRadius: "10px",
            fontSize: "13px", fontWeight: "600", cursor: "pointer",
            display: "flex", alignItems: "center", gap: "8px",
          }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
          Nouveau client
        </button>
      </div>

      {/* Search */}
      <div style={{ position: "relative", marginBottom: "20px", maxWidth: "360px" }}>
        <svg style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", color: "#94a3b8" }}
          width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
        </svg>
        <input
          style={{
            width: "100%", padding: "10px 12px 10px 38px",
            border: "1.5px solid #e2e8f0", borderRadius: "10px",
            fontSize: "14px", color: "#0f172a", background: "#fff", boxSizing: "border-box",
          }}
          placeholder="Rechercher un client..."
          value={recherche}
          onChange={(e) => setRecherche(e.target.value)}
        />
      </div>

      {chargement ? (
        <div style={{ background: "#fff", borderRadius: "16px", padding: "48px", textAlign: "center", color: "#94a3b8", border: "1px solid #e2e8f0" }}>
          Chargement...
        </div>
      ) : filtres.length === 0 ? (
        <div style={{ background: "#fff", borderRadius: "16px", padding: "64px 32px", textAlign: "center", border: "1px solid #e2e8f0" }}>
          <div style={{ fontSize: "48px", marginBottom: "16px" }}>👥</div>
          <p style={{ fontSize: "16px", fontWeight: "600", color: "#0f172a", marginBottom: "8px" }}>
            {recherche ? "Aucun résultat" : "Aucun client pour l'instant"}
          </p>
          <p style={{ fontSize: "14px", color: "#64748b", marginBottom: "24px" }}>
            {recherche ? "Modifiez votre recherche" : "Ajoutez votre premier client pour commencer"}
          </p>
          {!recherche && (
            <button
              onClick={() => navigate("/clients/nouveau")}
              style={{
                padding: "10px 20px", background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
                color: "#fff", border: "none", borderRadius: "10px",
                fontSize: "13px", fontWeight: "600", cursor: "pointer",
              }}
            >
              Créer mon premier client
            </button>
          )}
        </div>
      ) : (
        <div style={{ background: "#fff", borderRadius: "16px", border: "1px solid #e2e8f0", overflow: "hidden", boxShadow: "0 1px 4px rgba(0,0,0,0.04)" }}>
          {/* Table header */}
          <div style={{
            display: "grid", gridTemplateColumns: "2fr 2fr 1.2fr 0.8fr 1.2fr",
            padding: "12px 20px", background: "#f8fafc", borderBottom: "1px solid #e2e8f0",
            fontSize: "11px", fontWeight: "700", color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.05em",
          }}>
            <span>Client</span>
            <span>Email</span>
            <span>Téléphone</span>
            <span>Factures</span>
            <span>Actions</span>
          </div>

          {filtres.map((c, i) => (
            <div
              key={c.id}
              style={{
                display: "grid", gridTemplateColumns: "2fr 2fr 1.2fr 0.8fr 1.2fr",
                padding: "14px 20px", alignItems: "center",
                borderBottom: i < filtres.length - 1 ? "1px solid #f1f5f9" : "none",
                transition: "background 0.1s",
              }}
              onMouseEnter={(e) => e.currentTarget.style.background = "#fafafa"}
              onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                <div style={{
                  width: "36px", height: "36px", borderRadius: "10px",
                  background: couleurClient(c.id),
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: "13px", fontWeight: "700", color: "#fff", flexShrink: 0,
                }}>
                  {initiales(c.nom)}
                </div>
                <span style={{ fontSize: "14px", fontWeight: "600", color: "#0f172a" }}>{c.nom}</span>
              </div>
              <span style={{ fontSize: "13px", color: "#64748b" }}>{c.email}</span>
              <span style={{ fontSize: "13px", color: "#64748b" }}>{c.telephone || "—"}</span>
              <span style={{
                display: "inline-flex", alignItems: "center", justifyContent: "center",
                width: "28px", height: "28px", background: "#f1f5f9",
                borderRadius: "8px", fontSize: "13px", fontWeight: "600", color: "#475569",
              }}>
                {c.nombreFactures ?? 0}
              </span>
              <div style={{ display: "flex", gap: "8px" }}>
                <button
                  onClick={() => navigate(`/clients/${c.id}/modifier`)}
                  style={{
                    padding: "6px 12px", border: "1.5px solid #e2e8f0", borderRadius: "8px",
                    background: "#fff", fontSize: "12px", fontWeight: "500", color: "#374151", cursor: "pointer",
                  }}
                >
                  Modifier
                </button>
                <button
                  onClick={() => supprimer(c.id)}
                  style={{
                    padding: "6px 12px", border: "1.5px solid #fecaca", borderRadius: "8px",
                    background: "#fff", fontSize: "12px", fontWeight: "500", color: "#ef4444", cursor: "pointer",
                  }}
                >
                  Supprimer
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </Layout>
  );
};

export default ClientsList;

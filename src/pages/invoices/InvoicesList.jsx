import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../../components/Layout";
import invoiceService from "../../services/invoiceService";

const STATUT = {
  DRAFT:   { label: "Brouillon", bg: "#f1f5f9", color: "#64748b", dot: "#94a3b8" },
  SENT:    { label: "Envoyée",   bg: "#eff6ff", color: "#2563eb", dot: "#3b82f6" },
  PAID:    { label: "Payée",     bg: "#f0fdf4", color: "#16a34a", dot: "#22c55e" },
  OVERDUE: { label: "En retard", bg: "#fef2f2", color: "#dc2626", dot: "#ef4444" },
};

const Badge = ({ statut }) => {
  const s = STATUT[statut] || STATUT.DRAFT;
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: "6px",
      padding: "4px 10px", borderRadius: "20px",
      background: s.bg, color: s.color, fontSize: "12px", fontWeight: "600",
    }}>
      <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: s.dot }} />
      {s.label}
    </span>
  );
};

const InvoicesList = () => {
  const [factures, setFactures] = useState([]);
  const [chargement, setChargement] = useState(true);
  const [filtre, setFiltre] = useState("TOUS");
  const navigate = useNavigate();

  useEffect(() => {
    invoiceService.lister().then(setFactures).catch(console.error).finally(() => setChargement(false));
  }, []);

  const supprimer = async (id) => {
    if (!window.confirm("Supprimer cette facture ?")) return;
    try {
      await invoiceService.supprimer(id);
      setFactures((prev) => prev.filter((f) => f.id !== id));
    } catch (e) {
      alert(e.response?.data?.message || "Impossible de supprimer");
    }
  };

  const filtrees = filtre === "TOUS" ? factures : factures.filter((f) => f.statut === filtre);
  const filtres = ["TOUS", "DRAFT", "SENT", "PAID", "OVERDUE"];

  return (
    <Layout>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "28px" }}>
        <div>
          <h1 style={{ fontSize: "28px", fontWeight: "800", color: "#0f172a", letterSpacing: "-0.5px", marginBottom: "4px" }}>
            Factures
          </h1>
          <p style={{ fontSize: "14px", color: "#64748b" }}>
            {factures.length} facture{factures.length !== 1 ? "s" : ""} au total
          </p>
        </div>
        <button
          onClick={() => navigate("/factures/nouvelle")}
          style={{
            padding: "10px 20px", background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
            color: "#fff", border: "none", borderRadius: "10px",
            fontSize: "13px", fontWeight: "600", cursor: "pointer",
            display: "flex", alignItems: "center", gap: "8px",
          }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
          Nouvelle facture
        </button>
      </div>

      {/* Filtres */}
      <div style={{ display: "flex", gap: "6px", marginBottom: "20px" }}>
        {filtres.map((f) => {
          const label = f === "TOUS" ? "Toutes" : (STATUT[f]?.label || f);
          const count = f === "TOUS" ? factures.length : factures.filter((x) => x.statut === f).length;
          return (
            <button
              key={f}
              onClick={() => setFiltre(f)}
              style={{
                padding: "7px 14px", borderRadius: "20px", border: "1.5px solid",
                fontSize: "13px", fontWeight: "500", cursor: "pointer",
                borderColor: filtre === f ? "#6366f1" : "#e2e8f0",
                background: filtre === f ? "#eef2ff" : "#fff",
                color: filtre === f ? "#6366f1" : "#64748b",
              }}
            >
              {label} {count > 0 && <span style={{ opacity: 0.7 }}>({count})</span>}
            </button>
          );
        })}
      </div>

      {chargement ? (
        <div style={{ background: "#fff", borderRadius: "16px", padding: "48px", textAlign: "center", color: "#94a3b8", border: "1px solid #e2e8f0" }}>
          Chargement...
        </div>
      ) : filtrees.length === 0 ? (
        <div style={{ background: "#fff", borderRadius: "16px", padding: "64px 32px", textAlign: "center", border: "1px solid #e2e8f0" }}>
          <div style={{ fontSize: "48px", marginBottom: "16px" }}>🧾</div>
          <p style={{ fontSize: "16px", fontWeight: "600", color: "#0f172a", marginBottom: "8px" }}>Aucune facture</p>
          <p style={{ fontSize: "14px", color: "#64748b", marginBottom: "24px" }}>
            {filtre !== "TOUS" ? "Aucune facture avec ce statut" : "Créez votre première facture"}
          </p>
          {filtre === "TOUS" && (
            <button
              onClick={() => navigate("/factures/nouvelle")}
              style={{
                padding: "10px 20px", background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
                color: "#fff", border: "none", borderRadius: "10px",
                fontSize: "13px", fontWeight: "600", cursor: "pointer",
              }}
            >
              Créer ma première facture
            </button>
          )}
        </div>
      ) : (
        <div style={{ background: "#fff", borderRadius: "16px", border: "1px solid #e2e8f0", overflow: "hidden", boxShadow: "0 1px 4px rgba(0,0,0,0.04)" }}>
          {/* Header */}
          <div style={{
            display: "grid", gridTemplateColumns: "1.4fr 2fr 1.2fr 1.4fr 1.4fr 1.4fr",
            padding: "12px 20px", background: "#f8fafc", borderBottom: "1px solid #e2e8f0",
            fontSize: "11px", fontWeight: "700", color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.05em",
          }}>
            <span>Numéro</span>
            <span>Client</span>
            <span>Statut</span>
            <span>Montant TTC</span>
            <span>Échéance</span>
            <span>Actions</span>
          </div>

          {filtrees.map((f, i) => (
            <div
              key={f.id}
              style={{
                display: "grid", gridTemplateColumns: "1.4fr 2fr 1.2fr 1.4fr 1.4fr 1.4fr",
                padding: "14px 20px", alignItems: "center",
                borderBottom: i < filtrees.length - 1 ? "1px solid #f1f5f9" : "none",
                transition: "background 0.1s",
              }}
              onMouseEnter={(e) => e.currentTarget.style.background = "#fafafa"}
              onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}
            >
              <span
                onClick={() => navigate(`/factures/${f.id}`)}
                style={{ fontSize: "13px", fontWeight: "700", color: "#6366f1", cursor: "pointer" }}
              >
                {f.numero}
              </span>
              <span style={{ fontSize: "13px", color: "#0f172a", fontWeight: "500" }}>{f.clientNom}</span>
              <Badge statut={f.statut} />
              <span style={{ fontSize: "14px", fontWeight: "700", color: "#0f172a" }}>
                {f.montantTTC?.toLocaleString("fr-FR")} <span style={{ fontSize: "11px", color: "#94a3b8", fontWeight: "500" }}>FCFA</span>
              </span>
              <span style={{ fontSize: "13px", color: "#64748b" }}>{f.dateEcheance}</span>
              <div style={{ display: "flex", gap: "8px" }}>
                <button
                  onClick={() => navigate(`/factures/${f.id}`)}
                  style={{
                    padding: "6px 12px", border: "1.5px solid #e2e8f0", borderRadius: "8px",
                    background: "#fff", fontSize: "12px", fontWeight: "500", color: "#374151", cursor: "pointer",
                  }}
                >
                  Voir
                </button>
                {f.statut === "DRAFT" && (
                  <button
                    onClick={() => supprimer(f.id)}
                    style={{
                      padding: "6px 12px", border: "1.5px solid #fecaca", borderRadius: "8px",
                      background: "#fff", fontSize: "12px", fontWeight: "500", color: "#ef4444", cursor: "pointer",
                    }}
                  >
                    Supprimer
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </Layout>
  );
};

export default InvoicesList;

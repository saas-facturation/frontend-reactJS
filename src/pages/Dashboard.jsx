import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Layout from "../components/Layout";
import invoiceService from "../services/invoiceService";

const StatCard = ({ label, value, icon, color, bg, trend }) => (
  <div style={{
    background: "#fff", borderRadius: "16px", padding: "24px",
    border: "1px solid #e2e8f0", display: "flex", flexDirection: "column", gap: "16px",
    boxShadow: "0 1px 4px rgba(0,0,0,0.04)",
  }}>
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
      <div style={{
        width: "44px", height: "44px", borderRadius: "12px", background: bg,
        display: "flex", alignItems: "center", justifyContent: "center",
      }}>
        {icon}
      </div>
      {trend && (
        <span style={{
          fontSize: "11px", fontWeight: "600", padding: "3px 8px", borderRadius: "20px",
          background: trend > 0 ? "#f0fdf4" : "#fef2f2",
          color: trend > 0 ? "#16a34a" : "#dc2626",
        }}>
          {trend > 0 ? "+" : ""}{trend}%
        </span>
      )}
    </div>
    <div>
      <p style={{ fontSize: "13px", color: "#64748b", marginBottom: "4px", fontWeight: "500" }}>{label}</p>
      <p style={{ fontSize: "26px", fontWeight: "700", color, letterSpacing: "-0.5px" }}>{value}</p>
    </div>
  </div>
);

const Dashboard = () => {
  const { utilisateur } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [chargement, setChargement] = useState(true);

  useEffect(() => {
    invoiceService.stats().then(setStats).catch(console.error).finally(() => setChargement(false));
  }, []);

  const heure = new Date().getHours();
  const salutation = heure < 12 ? "Bonjour" : heure < 18 ? "Bon après-midi" : "Bonsoir";

  return (
    <Layout>
      {/* Header */}
      <div style={{ marginBottom: "32px" }}>
        <h1 style={{ fontSize: "28px", fontWeight: "800", color: "#0f172a", letterSpacing: "-0.5px", marginBottom: "4px" }}>
          {salutation}, {utilisateur?.nom?.split(" ")[0]}
        </h1>
        <p style={{ fontSize: "14px", color: "#64748b" }}>
          Voici un aperçu de votre activité
        </p>
      </div>

      {chargement ? (
        <div style={{ display: "flex", gap: "16px" }}>
          {[1,2,3,4,5].map((i) => (
            <div key={i} style={{
              flex: 1, height: "140px", borderRadius: "16px",
              background: "linear-gradient(90deg, #f1f5f9 25%, #e2e8f0 50%, #f1f5f9 75%)",
            }} />
          ))}
        </div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: "16px", marginBottom: "32px" }}>
          <StatCard
            label="Total clients"
            value={stats?.totalClients ?? 0}
            color="#6366f1"
            bg="rgba(99,102,241,0.1)"
            icon={<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#6366f1" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>}
          />
          <StatCard
            label="Factures ce mois"
            value={stats?.facturesCeMois ?? 0}
            color="#8b5cf6"
            bg="rgba(139,92,246,0.1)"
            icon={<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#8b5cf6" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>}
          />
          <StatCard
            label="En attente"
            value={stats?.facturesEnAttente ?? 0}
            color="#f59e0b"
            bg="rgba(245,158,11,0.1)"
            icon={<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" strokeWidth="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>}
          />
          <StatCard
            label="En retard"
            value={stats?.facturesEnRetard ?? 0}
            color="#ef4444"
            bg="rgba(239,68,68,0.1)"
            icon={<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>}
          />
          <StatCard
            label="Encaissé ce mois"
            value={`${(stats?.montantEncaisseMois ?? 0).toLocaleString("fr-FR")} F`}
            color="#10b981"
            bg="rgba(16,185,129,0.1)"
            icon={<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>}
          />
        </div>
      )}

      {/* Quick actions */}
      <div style={{ background: "#fff", borderRadius: "16px", padding: "24px", border: "1px solid #e2e8f0", boxShadow: "0 1px 4px rgba(0,0,0,0.04)" }}>
        <h2 style={{ fontSize: "15px", fontWeight: "700", color: "#0f172a", marginBottom: "16px" }}>
          Actions rapides
        </h2>
        <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
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
          <button
            onClick={() => navigate("/clients/nouveau")}
            style={{
              padding: "10px 20px", background: "#f8fafc",
              color: "#374151", border: "1.5px solid #e2e8f0", borderRadius: "10px",
              fontSize: "13px", fontWeight: "600", cursor: "pointer",
              display: "flex", alignItems: "center", gap: "8px",
            }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
            Nouveau client
          </button>
          <button
            onClick={() => navigate("/factures")}
            style={{
              padding: "10px 20px", background: "#f8fafc",
              color: "#374151", border: "1.5px solid #e2e8f0", borderRadius: "10px",
              fontSize: "13px", fontWeight: "600", cursor: "pointer",
            }}
          >
            Voir toutes les factures →
          </button>
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;

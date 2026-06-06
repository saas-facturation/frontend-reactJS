import { useNavigate } from "react-router-dom";

const PaiementAnnule = () => {
  const navigate = useNavigate();

  return (
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "100vh", background: "#f1f5f9" }}>
      <div style={{
        background: "#fff", borderRadius: "24px", padding: "56px 48px",
        textAlign: "center", maxWidth: "440px", width: "100%",
        border: "1px solid #e2e8f0", boxShadow: "0 8px 32px rgba(0,0,0,0.08)",
      }}>
        <div style={{
          width: "72px", height: "72px", borderRadius: "50%",
          background: "linear-gradient(135deg, #f59e0b, #d97706)",
          display: "flex", alignItems: "center", justifyContent: "center",
          margin: "0 auto 24px",
          boxShadow: "0 8px 24px rgba(245,158,11,0.3)",
        }}>
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </div>

        <h1 style={{ fontSize: "26px", fontWeight: "800", color: "#0f172a", marginBottom: "12px", letterSpacing: "-0.5px" }}>
          Paiement annulé
        </h1>
        <p style={{ fontSize: "15px", color: "#64748b", lineHeight: "1.6", marginBottom: "36px" }}>
          Le paiement a été annulé. La facture reste en attente de règlement. Vous pouvez réessayer à tout moment.
        </p>

        <div style={{ display: "flex", gap: "10px" }}>
          <button
            onClick={() => navigate(-1)}
            style={{
              flex: 1, padding: "12px", border: "1.5px solid #e2e8f0",
              background: "#fff", color: "#374151", borderRadius: "12px",
              fontSize: "14px", fontWeight: "600", cursor: "pointer",
            }}
          >
            Retour
          </button>
          <button
            onClick={() => navigate("/factures")}
            style={{
              flex: 1, padding: "12px",
              background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
              color: "#fff", border: "none", borderRadius: "12px",
              fontSize: "14px", fontWeight: "600", cursor: "pointer",
            }}
          >
            Mes factures
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaiementAnnule;

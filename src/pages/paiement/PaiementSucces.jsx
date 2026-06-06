import { useNavigate } from "react-router-dom";

const PaiementSucces = () => {
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
          background: "linear-gradient(135deg, #10b981, #059669)",
          display: "flex", alignItems: "center", justifyContent: "center",
          margin: "0 auto 24px",
          boxShadow: "0 8px 24px rgba(16,185,129,0.3)",
        }}>
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </div>

        <h1 style={{ fontSize: "26px", fontWeight: "800", color: "#0f172a", marginBottom: "12px", letterSpacing: "-0.5px" }}>
          Paiement confirmé !
        </h1>
        <p style={{ fontSize: "15px", color: "#64748b", lineHeight: "1.6", marginBottom: "36px" }}>
          Le paiement a été reçu avec succès. Un email de confirmation a été envoyé au client.
        </p>

        <button
          onClick={() => navigate("/factures")}
          style={{
            width: "100%", padding: "12px",
            background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
            color: "#fff", border: "none", borderRadius: "12px",
            fontSize: "14px", fontWeight: "600", cursor: "pointer",
          }}
        >
          Retour aux factures
        </button>
      </div>
    </div>
  );
};

export default PaiementSucces;

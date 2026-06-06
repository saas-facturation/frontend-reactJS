import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
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
      padding: "5px 12px", borderRadius: "20px",
      background: s.bg, color: s.color, fontSize: "13px", fontWeight: "600",
    }}>
      <span style={{ width: "7px", height: "7px", borderRadius: "50%", background: s.dot }} />
      {s.label}
    </span>
  );
};

const InvoiceDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [facture, setFacture] = useState(null);
  const [chargement, setChargement] = useState(true);
  const [paiementEnCours, setPaiementEnCours] = useState(false);

  useEffect(() => {
    invoiceService.getById(id).then(setFacture).catch(() => navigate("/factures")).finally(() => setChargement(false));
  }, [id]);

  const envoyerEtPayer = async () => {
    setPaiementEnCours(true);
    try {
      const url = await invoiceService.creerCheckout(id);
      window.location.href = url;
    } catch (e) {
      alert(e.response?.data?.message || "Erreur Stripe");
      setPaiementEnCours(false);
    }
  };

  const changerStatut = async (statut) => {
    try {
      const updated = await invoiceService.changerStatut(id, statut);
      setFacture(updated);
    } catch (e) {
      alert(e.response?.data?.message || "Erreur");
    }
  };

  if (chargement) return <Layout><p style={{ color: "#64748b", padding: "40px" }}>Chargement...</p></Layout>;
  if (!facture) return null;

  const sectionStyle = {
    background: "#fff", borderRadius: "16px", padding: "24px",
    border: "1px solid #e2e8f0", boxShadow: "0 1px 4px rgba(0,0,0,0.04)", marginBottom: "16px",
  };

  return (
    <Layout>
      <div style={{ maxWidth: "860px" }}>
        {/* Header */}
        <div style={{ marginBottom: "28px" }}>
          <button
            onClick={() => navigate("/factures")}
            style={{ background: "none", border: "none", color: "#64748b", cursor: "pointer", fontSize: "13px", padding: "0 0 10px", display: "flex", alignItems: "center", gap: "6px" }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="15 18 9 12 15 6"/></svg>
            Retour aux factures
          </button>

          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "6px" }}>
                <h1 style={{ fontSize: "28px", fontWeight: "800", color: "#0f172a", letterSpacing: "-0.5px", margin: 0 }}>
                  {facture.numero}
                </h1>
                <Badge statut={facture.statut} />
              </div>
              <p style={{ fontSize: "14px", color: "#64748b" }}>
                Émise le {facture.dateEmission} · Échéance le {facture.dateEcheance}
              </p>
            </div>

            <div style={{ display: "flex", gap: "10px" }}>
              {(facture.statut === "DRAFT" || facture.statut === "SENT") && (
                <button
                  onClick={envoyerEtPayer}
                  disabled={paiementEnCours}
                  style={{
                    padding: "10px 20px",
                    background: paiementEnCours ? "#c7d2fe" : "linear-gradient(135deg, #6366f1, #8b5cf6)",
                    color: "#fff", border: "none", borderRadius: "10px",
                    fontSize: "13px", fontWeight: "600", cursor: paiementEnCours ? "not-allowed" : "pointer",
                    display: "flex", alignItems: "center", gap: "8px",
                  }}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="1" y="4" width="22" height="16" rx="2" ry="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>
                  {paiementEnCours ? "Redirection..." : "Envoyer & Payer via Stripe"}
                </button>
              )}
              {facture.statut === "SENT" && (
                <button
                  onClick={() => changerStatut("PAID")}
                  style={{
                    padding: "10px 20px", background: "#f0fdf4",
                    color: "#16a34a", border: "1.5px solid #bbf7d0", borderRadius: "10px",
                    fontSize: "13px", fontWeight: "600", cursor: "pointer",
                  }}
                >
                  ✓ Marquer payée
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Client + Dates */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginBottom: "16px" }}>
          <div style={sectionStyle}>
            <p style={{ fontSize: "11px", fontWeight: "700", color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "14px" }}>Client</p>
            <p style={{ fontSize: "16px", fontWeight: "700", color: "#0f172a", marginBottom: "4px" }}>{facture.clientNom}</p>
            <p style={{ fontSize: "13px", color: "#64748b" }}>{facture.clientEmail}</p>
          </div>
          <div style={sectionStyle}>
            <p style={{ fontSize: "11px", fontWeight: "700", color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "14px" }}>Dates</p>
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "13px" }}>
                <span style={{ color: "#64748b" }}>Émission</span>
                <span style={{ fontWeight: "600", color: "#0f172a" }}>{facture.dateEmission}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "13px" }}>
                <span style={{ color: "#64748b" }}>Échéance</span>
                <span style={{ fontWeight: "600", color: "#0f172a" }}>{facture.dateEcheance}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Lignes */}
        <div style={sectionStyle}>
          <p style={{ fontSize: "11px", fontWeight: "700", color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "16px" }}>
            Détail des prestations
          </p>

          <div style={{
            display: "grid", gridTemplateColumns: "3fr 1fr 1.5fr 1.5fr",
            gap: "8px", paddingBottom: "10px", marginBottom: "4px",
            fontSize: "11px", fontWeight: "700", color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.05em",
          }}>
            <span>Description</span><span>Qté</span><span>Prix unitaire</span><span>Total</span>
          </div>

          {facture.lignes?.map((l, i) => (
            <div key={l.id} style={{
              display: "grid", gridTemplateColumns: "3fr 1fr 1.5fr 1.5fr",
              gap: "8px", padding: "12px 0", alignItems: "center",
              borderTop: "1px solid #f1f5f9", fontSize: "14px",
            }}>
              <span style={{ fontWeight: "500", color: "#0f172a" }}>{l.description}</span>
              <span style={{ color: "#64748b" }}>{l.quantite}</span>
              <span style={{ color: "#64748b" }}>{l.prixUnitaire?.toLocaleString("fr-FR")} FCFA</span>
              <span style={{ fontWeight: "600", color: "#0f172a" }}>{l.total?.toLocaleString("fr-FR")} FCFA</span>
            </div>
          ))}
        </div>

        {/* Totaux */}
        <div style={{
          ...sectionStyle,
          maxWidth: "340px", marginLeft: "auto",
        }}>
          {[
            { label: "Montant HT", value: `${facture.montantHT?.toLocaleString("fr-FR")} FCFA` },
            { label: `TVA (${facture.tauxTva}%)`, value: `${facture.montantTva?.toLocaleString("fr-FR")} FCFA` },
          ].map(({ label, value }) => (
            <div key={label} style={{ display: "flex", justifyContent: "space-between", fontSize: "13px", color: "#64748b", marginBottom: "10px" }}>
              <span>{label}</span><span>{value}</span>
            </div>
          ))}
          <div style={{ height: "1px", background: "#e2e8f0", margin: "14px 0" }} />
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: "17px", fontWeight: "700", color: "#0f172a" }}>
            <span>Total TTC</span>
            <span style={{ color: "#6366f1" }}>{facture.montantTTC?.toLocaleString("fr-FR")} FCFA</span>
          </div>
        </div>

        {/* Notes */}
        {facture.notes && (
          <div style={sectionStyle}>
            <p style={{ fontSize: "11px", fontWeight: "700", color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "12px" }}>Notes</p>
            <p style={{ fontSize: "14px", color: "#374151", lineHeight: "1.6" }}>{facture.notes}</p>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default InvoiceDetail;

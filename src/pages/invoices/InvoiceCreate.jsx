import { useEffect, useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import Layout from "../../components/Layout";
import clientService from "../../services/clientService";
import invoiceService from "../../services/invoiceService";

const InvoiceCreate = () => {
  const navigate = useNavigate();
  const [clients, setClients] = useState([]);
  const [totaux, setTotaux] = useState({ ht: 0, tva: 0, ttc: 0 });

  const { register, handleSubmit, control, watch, formState: { errors, isSubmitting } } = useForm({
    defaultValues: {
      dateEmission: new Date().toISOString().split("T")[0],
      dateEcheance: "",
      tauxTva: "18",
      notes: "",
      lignes: [{ description: "", quantite: 1, prixUnitaire: "" }],
    },
  });

  const { fields, append, remove } = useFieldArray({ control, name: "lignes" });

  useEffect(() => {
    clientService.lister().then(setClients).catch(console.error);
  }, []);

  const lignesWatch = watch("lignes");
  const tauxTvaWatch = watch("tauxTva");

  useEffect(() => {
    const ht = lignesWatch.reduce((sum, l) => sum + (parseFloat(l.quantite) || 0) * (parseFloat(l.prixUnitaire) || 0), 0);
    const taux = parseFloat(tauxTvaWatch) || 0;
    const tva = (ht * taux) / 100;
    setTotaux({ ht, tva, ttc: ht + tva });
  }, [lignesWatch, tauxTvaWatch]);

  const onSubmit = async (data) => {
    try {
      const payload = {
        clientId: parseInt(data.clientId),
        dateEmission: data.dateEmission,
        dateEcheance: data.dateEcheance,
        tauxTva: parseFloat(data.tauxTva),
        notes: data.notes,
        lignes: data.lignes.map((l) => ({
          description: l.description,
          quantite: parseInt(l.quantite),
          prixUnitaire: parseFloat(l.prixUnitaire),
        })),
      };
      const facture = await invoiceService.creer(payload);
      navigate(`/factures/${facture.id}`);
    } catch (e) {
      alert(e.response?.data?.message || "Erreur lors de la création");
    }
  };

  const inputStyle = {
    padding: "10px 13px", border: "1.5px solid #e2e8f0", borderRadius: "10px",
    fontSize: "14px", color: "#0f172a", background: "#fff",
    width: "100%", boxSizing: "border-box",
  };

  const sectionStyle = {
    background: "#fff", borderRadius: "16px", padding: "24px",
    border: "1px solid #e2e8f0", boxShadow: "0 1px 4px rgba(0,0,0,0.04)", marginBottom: "16px",
  };

  return (
    <Layout>
      {/* Header */}
      <div style={{ marginBottom: "28px" }}>
        <button
          onClick={() => navigate("/factures")}
          style={{ background: "none", border: "none", color: "#64748b", cursor: "pointer", fontSize: "13px", padding: "0 0 8px", display: "flex", alignItems: "center", gap: "6px" }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="15 18 9 12 15 6"/></svg>
          Retour aux factures
        </button>
        <h1 style={{ fontSize: "28px", fontWeight: "800", color: "#0f172a", letterSpacing: "-0.5px" }}>
          Nouvelle facture
        </h1>
      </div>

      <div style={{ maxWidth: "860px" }}>
        <form onSubmit={handleSubmit(onSubmit)}>

          {/* Infos générales */}
          <div style={sectionStyle}>
            <h2 style={{ fontSize: "14px", fontWeight: "700", color: "#0f172a", marginBottom: "20px", paddingBottom: "14px", borderBottom: "1px solid #f1f5f9" }}>
              Informations générales
            </h2>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
              <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                <label style={{ fontSize: "13px", fontWeight: "600", color: "#374151" }}>Client *</label>
                <select style={inputStyle} {...register("clientId", { required: true })}>
                  <option value="">Sélectionner un client</option>
                  {clients.map((c) => <option key={c.id} value={c.id}>{c.nom}</option>)}
                </select>
                {errors.clientId && <span style={{ fontSize: "12px", color: "#ef4444" }}>Client obligatoire</span>}
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                <label style={{ fontSize: "13px", fontWeight: "600", color: "#374151" }}>Taux TVA (%)</label>
                <input style={inputStyle} type="number" step="0.01" {...register("tauxTva")} />
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                <label style={{ fontSize: "13px", fontWeight: "600", color: "#374151" }}>Date d'émission *</label>
                <input style={inputStyle} type="date" {...register("dateEmission", { required: true })} />
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                <label style={{ fontSize: "13px", fontWeight: "600", color: "#374151" }}>Date d'échéance *</label>
                <input style={inputStyle} type="date" {...register("dateEcheance", { required: true })} />
                {errors.dateEcheance && <span style={{ fontSize: "12px", color: "#ef4444" }}>Date obligatoire</span>}
              </div>
            </div>
          </div>

          {/* Lignes */}
          <div style={sectionStyle}>
            <h2 style={{ fontSize: "14px", fontWeight: "700", color: "#0f172a", marginBottom: "20px", paddingBottom: "14px", borderBottom: "1px solid #f1f5f9" }}>
              Lignes de facture
            </h2>

            <div style={{
              display: "grid", gridTemplateColumns: "3fr 1fr 1.5fr 1.5fr 40px",
              gap: "8px", paddingBottom: "10px", marginBottom: "8px",
              fontSize: "11px", fontWeight: "700", color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.05em",
            }}>
              <span>Description</span><span>Qté</span><span>Prix unitaire</span><span>Total HT</span><span />
            </div>

            {fields.map((field, index) => {
              const q = parseFloat(lignesWatch[index]?.quantite) || 0;
              const p = parseFloat(lignesWatch[index]?.prixUnitaire) || 0;
              return (
                <div key={field.id} style={{ display: "grid", gridTemplateColumns: "3fr 1fr 1.5fr 1.5fr 40px", gap: "8px", marginBottom: "10px", alignItems: "center" }}>
                  <input style={inputStyle} placeholder="Description de la prestation..." {...register(`lignes.${index}.description`, { required: true })} />
                  <input style={inputStyle} type="number" min="1" {...register(`lignes.${index}.quantite`, { required: true, min: 1 })} />
                  <input style={inputStyle} type="number" step="0.01" placeholder="0" {...register(`lignes.${index}.prixUnitaire`, { required: true })} />
                  <div style={{
                    padding: "10px 13px", background: "#f8fafc", borderRadius: "10px",
                    fontSize: "14px", fontWeight: "600", color: "#0f172a",
                    border: "1.5px solid #f1f5f9",
                  }}>
                    {(q * p).toLocaleString("fr-FR")}
                  </div>
                  {fields.length > 1 ? (
                    <button
                      type="button"
                      onClick={() => remove(index)}
                      style={{
                        width: "36px", height: "36px", border: "1.5px solid #fecaca",
                        borderRadius: "8px", background: "#fff", color: "#ef4444",
                        cursor: "pointer", fontSize: "16px", display: "flex", alignItems: "center", justifyContent: "center",
                      }}
                    >
                      ✕
                    </button>
                  ) : <div />}
                </div>
              );
            })}

            <button
              type="button"
              onClick={() => append({ description: "", quantite: 1, prixUnitaire: "" })}
              style={{
                marginTop: "8px", padding: "9px 16px", border: "1.5px dashed #c7d2fe",
                borderRadius: "10px", background: "#fafafe", fontSize: "13px",
                color: "#6366f1", cursor: "pointer", fontWeight: "500",
                display: "flex", alignItems: "center", gap: "6px",
              }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
              Ajouter une ligne
            </button>
          </div>

          {/* Notes */}
          <div style={sectionStyle}>
            <h2 style={{ fontSize: "14px", fontWeight: "700", color: "#0f172a", marginBottom: "16px" }}>Notes (optionnel)</h2>
            <textarea
              style={{ ...inputStyle, height: "80px", resize: "vertical" }}
              placeholder="Conditions de paiement, mentions légales..."
              {...register("notes")}
            />
          </div>

          {/* Totaux */}
          <div style={{
            background: "#fff", borderRadius: "16px", padding: "24px",
            border: "1px solid #e2e8f0", marginBottom: "20px",
            maxWidth: "340px", marginLeft: "auto",
            boxShadow: "0 1px 4px rgba(0,0,0,0.04)",
          }}>
            {[
              { label: "Montant HT", value: `${totaux.ht.toLocaleString("fr-FR")} FCFA` },
              { label: `TVA (${tauxTvaWatch}%)`, value: `${totaux.tva.toLocaleString("fr-FR")} FCFA` },
            ].map(({ label, value }) => (
              <div key={label} style={{ display: "flex", justifyContent: "space-between", fontSize: "13px", color: "#64748b", marginBottom: "10px" }}>
                <span>{label}</span><span>{value}</span>
              </div>
            ))}
            <div style={{ height: "1px", background: "#e2e8f0", margin: "14px 0" }} />
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: "16px", fontWeight: "700", color: "#0f172a" }}>
              <span>Total TTC</span>
              <span style={{ color: "#6366f1" }}>{totaux.ttc.toLocaleString("fr-FR")} FCFA</span>
            </div>
          </div>

          {/* Actions */}
          <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px" }}>
            <button
              type="button"
              onClick={() => navigate("/factures")}
              style={{
                padding: "11px 24px", border: "1.5px solid #e2e8f0", borderRadius: "10px",
                background: "#fff", fontSize: "14px", fontWeight: "500", color: "#374151", cursor: "pointer",
              }}
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              style={{
                padding: "11px 28px",
                background: isSubmitting ? "#c7d2fe" : "linear-gradient(135deg, #6366f1, #8b5cf6)",
                color: "#fff", border: "none", borderRadius: "10px",
                fontSize: "14px", fontWeight: "600", cursor: isSubmitting ? "not-allowed" : "pointer",
              }}
            >
              {isSubmitting ? "Création..." : "Créer la facture"}
            </button>
          </div>
        </form>
      </div>
    </Layout>
  );
};

export default InvoiceCreate;

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import Layout from "../../components/Layout";
import clientService from "../../services/clientService";

const ClientForm = () => {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();

  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm();

  useEffect(() => {
    if (isEdit) {
      clientService.getById(id).then((data) => reset(data)).catch(console.error);
    }
  }, [id]);

  const onSubmit = async (data) => {
    try {
      if (isEdit) await clientService.modifier(id, data);
      else await clientService.creer(data);
      navigate("/clients");
    } catch (error) {
      alert(error.response?.data?.message || "Une erreur est survenue");
    }
  };

  const inputStyle = (hasError) => ({
    padding: "11px 14px", border: `1.5px solid ${hasError ? "#fca5a5" : "#e2e8f0"}`,
    borderRadius: "10px", fontSize: "14px", color: "#0f172a",
    background: "#fff", width: "100%", boxSizing: "border-box",
  });

  return (
    <Layout>
      {/* Header */}
      <div style={{ marginBottom: "28px" }}>
        <button
          onClick={() => navigate("/clients")}
          style={{ background: "none", border: "none", color: "#64748b", cursor: "pointer", fontSize: "13px", padding: "0 0 8px", display: "flex", alignItems: "center", gap: "6px" }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="15 18 9 12 15 6"/></svg>
          Retour aux clients
        </button>
        <h1 style={{ fontSize: "28px", fontWeight: "800", color: "#0f172a", letterSpacing: "-0.5px" }}>
          {isEdit ? "Modifier le client" : "Nouveau client"}
        </h1>
      </div>

      <div style={{ maxWidth: "680px" }}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div style={{
            background: "#fff", borderRadius: "16px", padding: "28px",
            border: "1px solid #e2e8f0", boxShadow: "0 1px 4px rgba(0,0,0,0.04)", marginBottom: "16px",
          }}>
            <h2 style={{ fontSize: "14px", fontWeight: "700", color: "#0f172a", marginBottom: "20px", paddingBottom: "14px", borderBottom: "1px solid #f1f5f9" }}>
              Informations du client
            </h2>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginBottom: "16px" }}>
              <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                <label style={{ fontSize: "13px", fontWeight: "600", color: "#374151" }}>Nom complet *</label>
                <input style={inputStyle(errors.nom)} placeholder="Entreprise Diallo" {...register("nom", { required: "Obligatoire" })} />
                {errors.nom && <span style={{ fontSize: "12px", color: "#ef4444" }}>{errors.nom.message}</span>}
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                <label style={{ fontSize: "13px", fontWeight: "600", color: "#374151" }}>Email *</label>
                <input style={inputStyle(errors.email)} type="email" placeholder="contact@entreprise.sn" {...register("email", { required: "Obligatoire" })} />
                {errors.email && <span style={{ fontSize: "12px", color: "#ef4444" }}>{errors.email.message}</span>}
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                <label style={{ fontSize: "13px", fontWeight: "600", color: "#374151" }}>Téléphone</label>
                <input style={inputStyle(false)} placeholder="+221 77 000 00 00" {...register("telephone")} />
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                <label style={{ fontSize: "13px", fontWeight: "600", color: "#374151" }}>SIREN / NINEA</label>
                <input style={inputStyle(false)} placeholder="123456789" {...register("siren")} />
              </div>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
              <label style={{ fontSize: "13px", fontWeight: "600", color: "#374151" }}>Adresse</label>
              <textarea
                style={{ ...inputStyle(false), height: "90px", resize: "vertical" }}
                placeholder="Dakar, Sénégal"
                {...register("adresse")}
              />
            </div>
          </div>

          <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px" }}>
            <button
              type="button"
              onClick={() => navigate("/clients")}
              style={{
                padding: "10px 22px", border: "1.5px solid #e2e8f0", borderRadius: "10px",
                background: "#fff", fontSize: "14px", fontWeight: "500", color: "#374151", cursor: "pointer",
              }}
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              style={{
                padding: "10px 24px",
                background: isSubmitting ? "#c7d2fe" : "linear-gradient(135deg, #6366f1, #8b5cf6)",
                color: "#fff", border: "none", borderRadius: "10px",
                fontSize: "14px", fontWeight: "600", cursor: isSubmitting ? "not-allowed" : "pointer",
              }}
            >
              {isSubmitting ? "Enregistrement..." : isEdit ? "Enregistrer les modifications" : "Créer le client"}
            </button>
          </div>
        </form>
      </div>
    </Layout>
  );
};

export default ClientForm;

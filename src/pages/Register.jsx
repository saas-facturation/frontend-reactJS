import { useForm } from "react-hook-form";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useState } from "react";

const Register = () => {
  const { inscrire } = useAuth();
  const navigate = useNavigate();
  const [erreur, setErreur] = useState(null);
  const [chargement, setChargement] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm();

  const onSubmit = async (data) => {
    setErreur(null);
    setChargement(true);
    try {
      await inscrire(data.nom, data.email, data.password);
      navigate("/dashboard");
    } catch (error) {
      setErreur(error.response?.data?.message || "Une erreur est survenue");
    } finally {
      setChargement(false);
    }
  };

  return (
    <div style={s.page}>
      {/* Left panel */}
      <div style={s.left}>
        <div style={s.brand}>
          <div style={s.logo}>F</div>
          <span style={s.brandName}>FacturePro</span>
        </div>
        <div style={s.pitch}>
          <h2 style={s.pitchTitle}>Démarrez en<br />quelques minutes.</h2>
          <p style={s.pitchSub}>Créez votre compte gratuitement et commencez à facturer vos clients dès aujourd'hui.</p>
          <div style={s.features}>
            {[
              "Factures PDF professionnelles",
              "Suivi des paiements en temps réel",
              "Paiement en ligne via Stripe",
              "Gestion multi-clients",
            ].map((f) => (
              <div key={f} style={s.feature}>
                <span style={s.featureCheck}>✓</span>
                <span style={s.featureText}>{f}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right panel */}
      <div style={s.right}>
        <div style={s.card}>
          <div style={s.cardHeader}>
            <h1 style={s.titre}>Créer un compte</h1>
            <p style={s.sousTitre}>Gratuit, sans carte bancaire requise</p>
          </div>

          {erreur && (
            <div style={s.alerteErreur}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ flexShrink: 0 }}>
                <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
              {erreur}
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            <div style={s.champ}>
              <label style={s.label}>Nom complet</label>
              <input
                style={{ ...s.input, ...(errors.nom ? s.inputErreur : {}) }}
                placeholder="Karim Diallo"
                {...register("nom", { required: "Le nom est obligatoire" })}
              />
              {errors.nom && <span style={s.erreurMsg}>{errors.nom.message}</span>}
            </div>

            <div style={s.champ}>
              <label style={s.label}>Adresse email</label>
              <input
                style={{ ...s.input, ...(errors.email ? s.inputErreur : {}) }}
                type="email"
                placeholder="vous@exemple.com"
                {...register("email", {
                  required: "L'email est obligatoire",
                  pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: "Format invalide" },
                })}
              />
              {errors.email && <span style={s.erreurMsg}>{errors.email.message}</span>}
            </div>

            <div style={s.champ}>
              <label style={s.label}>Mot de passe</label>
              <input
                style={{ ...s.input, ...(errors.password ? s.inputErreur : {}) }}
                type="password"
                placeholder="Au moins 8 caractères"
                {...register("password", {
                  required: "Le mot de passe est obligatoire",
                  minLength: { value: 8, message: "Minimum 8 caractères" },
                })}
              />
              {errors.password && <span style={s.erreurMsg}>{errors.password.message}</span>}
            </div>

            <button type="submit" style={chargement ? s.btnDisabled : s.btn} disabled={chargement}>
              {chargement ? (
                <span style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "8px" }}>
                  <span style={s.spinner} />
                  Création du compte...
                </span>
              ) : "Créer mon compte"}
            </button>
          </form>

          <p style={s.cgu}>
            En créant un compte, vous acceptez nos{" "}
            <span style={s.link}>conditions d'utilisation</span> et notre{" "}
            <span style={s.link}>politique de confidentialité</span>.
          </p>

          <p style={s.footer}>
            Déjà un compte ?{" "}
            <Link to="/login" style={s.linkBold}>Se connecter</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

const s = {
  page: { display: "flex", minHeight: "100vh" },
  left: {
    flex: 1, background: "linear-gradient(145deg, #0f172a 0%, #1e1b4b 100%)",
    display: "flex", flexDirection: "column", padding: "40px 48px",
  },
  brand: { display: "flex", alignItems: "center", gap: "10px" },
  logo: {
    width: "36px", height: "36px", borderRadius: "10px",
    background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
    display: "flex", alignItems: "center", justifyContent: "center",
    fontSize: "18px", fontWeight: "700", color: "#fff",
  },
  brandName: { fontSize: "18px", fontWeight: "700", color: "#fff" },
  pitch: { flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", maxWidth: "420px" },
  pitchTitle: { fontSize: "42px", fontWeight: "800", color: "#fff", lineHeight: "1.15", marginBottom: "16px", letterSpacing: "-1px" },
  pitchSub: { fontSize: "16px", color: "rgba(255,255,255,0.55)", lineHeight: "1.6", marginBottom: "40px" },
  features: { display: "flex", flexDirection: "column", gap: "14px" },
  feature: { display: "flex", alignItems: "center", gap: "12px" },
  featureCheck: {
    width: "22px", height: "22px", borderRadius: "50%",
    background: "rgba(99,102,241,0.2)", border: "1px solid rgba(99,102,241,0.4)",
    display: "flex", alignItems: "center", justifyContent: "center",
    fontSize: "12px", color: "#818cf8", flexShrink: 0,
    lineHeight: "22px", textAlign: "center",
  },
  featureText: { fontSize: "14px", color: "rgba(255,255,255,0.7)" },
  right: {
    width: "480px", background: "#f8fafc",
    display: "flex", alignItems: "center", justifyContent: "center", padding: "40px 32px",
  },
  card: {
    width: "100%", maxWidth: "400px",
    background: "#fff", borderRadius: "20px",
    padding: "36px", boxShadow: "0 4px 24px rgba(0,0,0,0.06)",
    border: "1px solid #e2e8f0",
  },
  cardHeader: { marginBottom: "28px" },
  titre: { fontSize: "26px", fontWeight: "700", color: "#0f172a", marginBottom: "6px", letterSpacing: "-0.5px" },
  sousTitre: { fontSize: "14px", color: "#94a3b8" },
  alerteErreur: {
    display: "flex", alignItems: "center", gap: "8px",
    background: "#fef2f2", border: "1px solid #fecaca",
    color: "#dc2626", borderRadius: "10px", padding: "10px 14px",
    fontSize: "13px", marginBottom: "4px",
  },
  champ: { display: "flex", flexDirection: "column", gap: "6px" },
  label: { fontSize: "13px", fontWeight: "600", color: "#374151" },
  input: {
    padding: "11px 14px", border: "1.5px solid #e2e8f0", borderRadius: "10px",
    fontSize: "14px", color: "#0f172a", background: "#fff", transition: "border 0.15s",
    width: "100%", boxSizing: "border-box",
  },
  inputErreur: { borderColor: "#fca5a5" },
  erreurMsg: { fontSize: "12px", color: "#dc2626" },
  btn: {
    padding: "12px", background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
    color: "#fff", border: "none", borderRadius: "10px",
    fontSize: "14px", fontWeight: "600", cursor: "pointer",
    transition: "opacity 0.15s", marginTop: "4px",
  },
  btnDisabled: {
    padding: "12px", background: "#c7d2fe",
    color: "#fff", border: "none", borderRadius: "10px",
    fontSize: "14px", fontWeight: "600", cursor: "not-allowed", marginTop: "4px",
  },
  spinner: {
    width: "14px", height: "14px", border: "2px solid rgba(255,255,255,0.3)",
    borderTopColor: "#fff", borderRadius: "50%", display: "inline-block",
  },
  cgu: { fontSize: "12px", color: "#94a3b8", textAlign: "center", marginTop: "16px", lineHeight: "1.5" },
  link: { color: "#6366f1", cursor: "pointer" },
  footer: { textAlign: "center", fontSize: "13px", color: "#94a3b8", marginTop: "12px" },
  linkBold: { color: "#6366f1", textDecoration: "none", fontWeight: "600" },
};

export default Register;

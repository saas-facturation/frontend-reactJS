import { useForm } from "react-hook-form";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useState } from "react";

const Login = () => {
  const { connecter } = useAuth();
  const navigate = useNavigate();
  const [erreur, setErreur] = useState(null);
  const [chargement, setChargement] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm();

  const onSubmit = async (data) => {
    setErreur(null);
    setChargement(true);
    try {
      await connecter(data.email, data.password);
      navigate("/dashboard");
    } catch (error) {
      setErreur(error.response?.data?.message || "Email ou mot de passe incorrect");
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
          <h2 style={s.pitchTitle}>Gérez vos factures<br />en toute simplicité.</h2>
          <p style={s.pitchSub}>Créez, envoyez et suivez vos factures professionnelles depuis un seul espace.</p>
          <div style={s.stats}>
            {[["500+", "Entreprises"], ["98%", "Satisfaction"], ["2min", "Par facture"]].map(([val, lab]) => (
              <div key={lab} style={s.stat}>
                <span style={s.statVal}>{val}</span>
                <span style={s.statLab}>{lab}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right panel */}
      <div style={s.right}>
        <div style={s.card}>
          <div style={s.cardHeader}>
            <h1 style={s.titre}>Connexion</h1>
            <p style={s.sousTitre}>Bienvenue, ravi de vous revoir</p>
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
              <label style={s.label}>Adresse email</label>
              <input
                style={{ ...s.input, ...(errors.email ? s.inputErreur : {}) }}
                type="email"
                placeholder="vous@exemple.com"
                {...register("email", { required: "L'email est obligatoire" })}
              />
              {errors.email && <span style={s.erreurMsg}>{errors.email.message}</span>}
            </div>

            <div style={s.champ}>
              <label style={s.label}>Mot de passe</label>
              <input
                style={{ ...s.input, ...(errors.password ? s.inputErreur : {}) }}
                type="password"
                placeholder="••••••••"
                {...register("password", { required: "Le mot de passe est obligatoire" })}
              />
              {errors.password && <span style={s.erreurMsg}>{errors.password.message}</span>}
            </div>

            <button type="submit" style={chargement ? s.btnDisabled : s.btn} disabled={chargement}>
              {chargement ? (
                <span style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "8px" }}>
                  <span style={s.spinner} />
                  Connexion...
                </span>
              ) : "Se connecter"}
            </button>
          </form>

          <div style={s.divider}>
            <span style={s.dividerLine} />
            <span style={s.dividerText}>ou continuer avec</span>
            <span style={s.dividerLine} />
          </div>

          <div style={{ display: "flex", gap: "10px" }}>
            {[
              { href: "/oauth2/authorization/google", label: "Google", icon: "G" },
              { href: "/oauth2/authorization/github", label: "GitHub", icon: "GH" },
            ].map(({ href, label, icon }) => (
              <a key={label} href={href} style={s.btnSocial}>
                <span style={s.socialIcon}>{icon}</span>
                {label}
              </a>
            ))}
          </div>

          <p style={s.footer}>
            Pas encore de compte ?{" "}
            <Link to="/register" style={s.link}>S'inscrire gratuitement</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

const s = {
  page: {
    display: "flex", minHeight: "100vh",
  },
  left: {
    flex: 1, background: "linear-gradient(145deg, #0f172a 0%, #1e1b4b 100%)",
    display: "flex", flexDirection: "column", padding: "40px 48px",
    "@media (max-width: 768px)": { display: "none" },
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
  pitchSub: { fontSize: "16px", color: "rgba(255,255,255,0.55)", lineHeight: "1.6", marginBottom: "48px" },
  stats: { display: "flex", gap: "32px" },
  stat: { display: "flex", flexDirection: "column", gap: "4px" },
  statVal: { fontSize: "28px", fontWeight: "700", color: "#fff" },
  statLab: { fontSize: "13px", color: "rgba(255,255,255,0.4)" },
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
    borderTopColor: "#fff", borderRadius: "50%",
    animation: "spin 0.7s linear infinite", display: "inline-block",
  },
  divider: { display: "flex", alignItems: "center", gap: "12px", margin: "22px 0" },
  dividerLine: { flex: 1, height: "1px", background: "#e2e8f0" },
  dividerText: { fontSize: "12px", color: "#94a3b8", whiteSpace: "nowrap" },
  btnSocial: {
    flex: 1, padding: "10px 14px", border: "1.5px solid #e2e8f0", borderRadius: "10px",
    background: "#fff", cursor: "pointer", fontSize: "13px", fontWeight: "500",
    textAlign: "center", textDecoration: "none", color: "#374151",
    display: "flex", alignItems: "center", justifyContent: "center", gap: "8px",
    transition: "border-color 0.15s",
  },
  socialIcon: {
    width: "20px", height: "20px", borderRadius: "4px",
    background: "#f1f5f9", fontSize: "10px", fontWeight: "700",
    display: "flex", alignItems: "center", justifyContent: "center", color: "#475569",
  },
  footer: { textAlign: "center", fontSize: "13px", color: "#94a3b8", marginTop: "22px" },
  link: { color: "#6366f1", textDecoration: "none", fontWeight: "600" },
};

export default Login;

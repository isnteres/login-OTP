import { useState } from "react";
import { useNavigate } from "react-router-dom";
import OtpInput from "../../components/OtpInput";
import { authService } from "../../services/authService";

export default function RegisterFlow() {
  const navigate = useNavigate();
  const [step, setStep]           = useState(1);
  const [email, setEmail]         = useState("");
  const [password, setPassword]   = useState("");
  const [otp, setOtp]             = useState("");
  const [userType, setUserType]   = useState(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError]         = useState("");

  const nextStep = () => {
    setIsAnimating(true);
    setTimeout(() => { setStep((s) => s + 1); setIsAnimating(false); setError(""); }, 300);
  };

  const handleSendOtp = async () => {
    if (!email || !email.includes("@")) { setError("Por favor ingresa un correo válido"); return; }
    setIsLoading(true); setError("");
    try { await authService.registerSendOtp(email); nextStep(); }
    catch (err) { setError(err.message || "Error al enviar el código"); }
    finally { setIsLoading(false); }
  };

  const handleVerifyOtp = async () => {
    if (otp.length !== 6) { setError("Por favor ingresa el código completo de 6 dígitos"); return; }
    setIsLoading(true); setError("");
    try { await authService.registerVerifyOtp(email, otp); nextStep(); }
    catch (err) { setError(err.message || "Código inválido o expirado"); }
    finally { setIsLoading(false); }
  };

  const handleCreatePassword = async () => {
    if (!password || password.length < 8) { setError("La contraseña debe tener al menos 8 caracteres"); return; }
    if (!/[A-Z]/.test(password)) { setError("La contraseña debe contener al menos una mayúscula"); return; }
    if (!/[0-9]/.test(password)) { setError("La contraseña debe contener al menos un número"); return; }
    setIsLoading(true); setError("");
    try {
      const res = await authService.registerCreatePassword(email, password);
      const tipo = res?.user?.userType ?? "client";
      setUserType(tipo);
      if (tipo === "client") localStorage.setItem("user", JSON.stringify(res.user));
      nextStep();
    }
    catch (err) { setError(err.message || "Error al crear la contraseña"); }
    finally { setIsLoading(false); }
  };

  const handleResendOtp = async () => {
    setIsLoading(true); setError(""); setOtp("");
    try { await authService.registerSendOtp(email); }
    catch (err) { setError(err.message || "Error al reenviar el código"); }
    finally { setIsLoading(false); }
  };

  const handleFinish = () => {
    userType === "client" ? navigate("/") : navigate("/login");
  };

  return (
    <div className="auth-container">
      <div className="bg-gradient"></div>
      <div className="bg-orbs">
        <div className="orb orb-1"></div><div className="orb orb-2"></div><div className="orb orb-3"></div>
      </div>
      <div className={`auth-card ${isAnimating ? "transitioning" : ""}`}>

        {error && (
          <div style={{ background:"rgba(239,68,68,0.1)", border:"1px solid rgba(239,68,68,0.3)", padding:"12px 16px", borderRadius:"8px", margin:"0 0 16px", color:"#f87171", fontSize:"14px", textAlign:"center" }}>
            {error}
          </div>
        )}

        <div className="content-area">
          {step === 1 && (
            <div className="step-content fade-in">
              <div className="icon-wrapper">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                  <polyline points="22,6 12,13 2,6"/>
                </svg>
              </div>
              <h2 className="step-title">Crear cuenta</h2>
              <p className="step-description">Ingresa tu correo para registrarte</p>
              <div className="input-group">
                <label>Correo electrónico</label>
                <input type="email" placeholder="tu@email.com" className="input-field"
                  value={email} onChange={(e) => { setEmail(e.target.value); setError(""); }}
                  onKeyDown={(e) => e.key === "Enter" && handleSendOtp()} disabled={isLoading} autoFocus />
              </div>
              <button onClick={handleSendOtp} className="btn-primary" disabled={isLoading || !email} style={{ opacity: isLoading || !email ? 0.6 : 1 }}>
                <span>{isLoading ? "Enviando..." : "Continuar"}</span>
              </button>
              <button className="btn-link" onClick={() => navigate("/")}>← Volver al inicio</button>
            </div>
          )}

          {step === 2 && (
            <div className="step-content fade-in">
              <div className="icon-wrapper">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                  <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                </svg>
              </div>
              <h2 className="step-title">Verificación</h2>
              <p className="step-description">Enviamos un código a <strong>{email}</strong></p>
              <div className="otp-container">
                <OtpInput value={otp} onChange={setOtp} disabled={isLoading} />
              </div>
              <button onClick={handleVerifyOtp} className="btn-primary" disabled={isLoading || otp.length !== 6} style={{ opacity: isLoading || otp.length !== 6 ? 0.6 : 1 }}>
                <span>{isLoading ? "Verificando..." : "Verificar código"}</span>
              </button>
              <button className="btn-link" onClick={handleResendOtp} disabled={isLoading}>
                {isLoading ? "Reenviando..." : "Reenviar código"}
              </button>
            </div>
          )}

          {step === 3 && (
            <div className="step-content fade-in">
              <div className="icon-wrapper">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 2a5 5 0 0 0-5 5v3H5a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-8a2 2 0 0 0-2-2h-2V7a5 5 0 0 0-5-5z"/>
                </svg>
              </div>
              <h2 className="step-title">Crear contraseña</h2>
              <p className="step-description">Elige una contraseña segura</p>
              <div className="input-group">
                <label>Nueva contraseña</label>
                <input type="password" placeholder="••••••••" className="input-field"
                  value={password} onChange={(e) => { setPassword(e.target.value); setError(""); }}
                  onKeyDown={(e) => e.key === "Enter" && handleCreatePassword()} disabled={isLoading} autoFocus />
              </div>
              <div className="password-requirements">
                {[
                  { ok: password.length >= 8, label: "Mínimo 8 caracteres" },
                  { ok: /[A-Z]/.test(password), label: "Una mayúscula" },
                  { ok: /[0-9]/.test(password), label: "Un número" },
                ].map(({ ok, label }) => (
                  <div key={label} className={`requirement ${ok ? "met" : ""}`}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="20 6 9 17 4 12"/></svg>
                    <span>{label}</span>
                  </div>
                ))}
              </div>
              <button onClick={handleCreatePassword} className="btn-primary btn-success" disabled={isLoading || password.length < 8} style={{ opacity: isLoading || password.length < 8 ? 0.6 : 1 }}>
                <span>{isLoading ? "Creando..." : "Crear cuenta"}</span>
              </button>
            </div>
          )}

          {step === 4 && (
            <div className="step-content fade-in success-screen">
              <div className="success-icon">
                <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                  <polyline points="22 4 12 14.01 9 11.01"/>
                </svg>
              </div>
              <h2 className="step-title">¡Todo listo!</h2>
              <p className="step-description">
                {userType === "client"
                  ? "Tu cuenta fue creada. Ya podés explorar los cursos."
                  : "Tu cuenta fue creada. Iniciá sesión para continuar."}
              </p>
              <button className="btn-primary btn-wide" onClick={handleFinish}>
                <span>{userType === "client" ? "Ver cursos" : "Iniciar sesión"}</span>
              </button>
            </div>
          )}
        </div>

        <div className="card-footer">
          <p>¿Necesitas ayuda? <a href="#">Contacta soporte</a></p>
        </div>
      </div>
    </div>
  );
}
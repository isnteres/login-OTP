import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { authService } from "../../services/authService";
import OtpInput from "../../components/OtpInput";

const saveToken = (token) => localStorage.setItem("token", token);

export default function LoginFlow() {
  const navigate = useNavigate();
  const [step, setStep] = useState("credentials");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  // ── Paso 1: credenciales ──
  const handleLogin = async () => {
    if (!email || !password) return;
    setIsLoading(true);
    setError("");
    try {
      const data = await authService.loginCredentials(email, password);

      if (data.status === "success") {
        // Pequeño delay para que localStorage se actualice antes de navegar
        setTimeout(() => navigate("/dashboard"), 100);
      } else if (data.status === "change_password") {
        setStep("change_password");
      } else if (data.status === "otp_required") {
        setStep("otp");
      }
    } catch (err) {
      setError(err.message || "Correo o contraseña incorrectos");
    } finally {
      setIsLoading(false);
    }
  };

  // ── Paso 2a: cambiar contraseña temporal ──
  const handleChangePassword = async () => {
    if (!newPassword || newPassword.length < 8) {
      setError("Mínimo 8 caracteres");
      return;
    }
    if (!/[A-Z]/.test(newPassword)) {
      setError("Debe contener al menos una mayúscula");
      return;
    }
    if (!/[0-9]/.test(newPassword)) {
      setError("Debe contener al menos un número");
      return;
    }
    setIsLoading(true);
    setError("");
    try {
      // Backend devuelve token directo sin OTP
      const data = await authService.loginChangePassword(email, newPassword);
      saveToken(data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      navigate("/dashboard");
    } catch (err) {
      setError(err.message || "Error al cambiar contraseña");
    } finally {
      setIsLoading(false);
    }
  };

  // ── Paso 2b: verificar OTP ──
  const handleVerifyOtp = async () => {
    if (otp.length !== 6) return;
    setIsLoading(true);
    setError("");
    try {
      await authService.loginVerifyOtp(email, otp);
      navigate("/dashboard");
    } catch (err) {
      setError(err.message || "Código inválido o expirado");
    } finally {
      setIsLoading(false);
    }
  };

  // ── Reenviar OTP ──
  const handleResendOtp = async () => {
    setIsLoading(true);
    setError("");
    setOtp("");
    try {
      await authService.loginCredentials(email, password);
    } catch (err) {
      setError(err.message || "Error al reenviar");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="bg-gradient"></div>
      <div className="bg-orbs">
        <div className="orb orb-1"></div>
        <div className="orb orb-2"></div>
        <div className="orb orb-3"></div>
      </div>

      <div className="auth-card">
        {error && (
          <div
            style={{
              background: "#fee2e2",
              border: "1px solid #fca5a5",
              padding: "12px 16px",
              borderRadius: "8px",
              margin: "0 32px 16px",
              color: "#dc2626",
              fontSize: "14px",
              textAlign: "center",
            }}
          >
            {error}
          </div>
        )}

        <div className="content-area">
          {/* ── STEP 1: Credenciales ── */}
          {step === "credentials" && (
            <div className="step-content fade-in">
              <div className="icon-wrapper">
                <svg
                  width="48"
                  height="48"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                  <polyline points="22,6 12,13 2,6" />
                </svg>
              </div>
              <h2 className="step-title">Iniciar sesión</h2>
              <p className="step-description">Ingresa tus credenciales</p>
              <div className="input-group">
                <label>Correo electrónico</label>
                <input
                  type="email"
                  placeholder="tu@email.com"
                  className="input-field"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setError("");
                  }}
                  onKeyPress={(e) => e.key === "Enter" && handleLogin()}
                  disabled={isLoading}
                  autoFocus
                />
              </div>
              <div className="input-group">
                <label>Contraseña</label>
                <input
                  type="password"
                  placeholder="••••••••"
                  className="input-field"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setError("");
                  }}
                  onKeyPress={(e) => e.key === "Enter" && handleLogin()}
                  disabled={isLoading}
                />
              </div>
              <button
                onClick={handleLogin}
                className="btn-primary"
                disabled={isLoading || !email || !password}
                style={{ opacity: isLoading || !email || !password ? 0.6 : 1 }}
              >
                <span>{isLoading ? "Verificando..." : "Ingresar"}</span>
              </button>
              <button
                className="btn-link"
                onClick={() => navigate("/")}
                style={{ marginTop: "12px" }}
              >
                ← Volver
              </button>
            </div>
          )}

          {/* ── STEP 2a: Cambiar contraseña temporal ── */}
          {step === "change_password" && (
            <div className="step-content fade-in">
              <div className="icon-wrapper">
                <svg
                  width="48"
                  height="48"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                  <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                </svg>
              </div>
              <h2 className="step-title">Nueva contraseña</h2>
              <p className="step-description">
                Es tu primer ingreso, crea una contraseña segura
              </p>
              <div className="input-group">
                <label>Nueva contraseña</label>
                <input
                  type="password"
                  placeholder="••••••••"
                  className="input-field"
                  value={newPassword}
                  onChange={(e) => {
                    setNewPassword(e.target.value);
                    setError("");
                  }}
                  onKeyPress={(e) =>
                    e.key === "Enter" && handleChangePassword()
                  }
                  disabled={isLoading}
                  autoFocus
                />
              </div>
              <div className="password-requirements">
                <div
                  className={`requirement ${newPassword.length >= 8 ? "met" : ""}`}
                >
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  <span>Mínimo 8 caracteres</span>
                </div>
                <div
                  className={`requirement ${/[A-Z]/.test(newPassword) ? "met" : ""}`}
                >
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  <span>Una mayúscula</span>
                </div>
                <div
                  className={`requirement ${/[0-9]/.test(newPassword) ? "met" : ""}`}
                >
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  <span>Un número</span>
                </div>
              </div>
              <button
                onClick={handleChangePassword}
                className="btn-primary"
                disabled={isLoading || newPassword.length < 8}
                style={{
                  opacity: isLoading || newPassword.length < 8 ? 0.6 : 1,
                }}
              >
                <span>{isLoading ? "Guardando..." : "Guardar contraseña"}</span>
              </button>
            </div>
          )}

          {/* ── STEP 2b: OTP ── */}
          {step === "otp" && (
            <div className="step-content fade-in">
              <div className="icon-wrapper">
                <svg
                  width="48"
                  height="48"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                  <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                </svg>
              </div>
              <h2 className="step-title">Verificación</h2>
              <p className="step-description">
                Enviamos un código a <strong>{email}</strong>
              </p>
              <div className="otp-container">
                <OtpInput value={otp} onChange={setOtp} disabled={isLoading} />
              </div>
              <button
                onClick={handleVerifyOtp}
                className="btn-primary"
                disabled={isLoading || otp.length !== 6}
                style={{ opacity: isLoading || otp.length !== 6 ? 0.6 : 1 }}
              >
                <span>{isLoading ? "Verificando..." : "Verificar código"}</span>
              </button>
              <button
                className="btn-link"
                onClick={handleResendOtp}
                disabled={isLoading}
              >
                {isLoading ? "Reenviando..." : "Reenviar código"}
              </button>
            </div>
          )}
        </div>

        <div className="card-footer">
          <p>
            ¿Necesitas ayuda? <a href="#">Contacta soporte</a>
          </p>
        </div>
      </div>
    </div>
  );
}

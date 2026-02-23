import { useState } from "react";
import { useNavigate } from "react-router-dom";
import OtpInput from "../../components/OtpInput";
import { authService } from "../../services/authService";

export default function AuthFlow() {
  const [step, setStep] = useState(1);
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [isAnimating, setIsAnimating] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const nextStep = () => {
    setIsAnimating(true);
    setTimeout(() => {
      setStep(step + 1);
      setIsAnimating(false);
      setError("");
    }, 300);
  };

  // Enviar OTP
  const handleSendOtp = async () => {
    if (!email || !email.includes("@")) {
      setError("Por favor ingresa un correo válido");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      await authService.sendOtp(email);
      nextStep();
    } catch (err) {
      setError(err.message || "Error al enviar el código");
    } finally {
      setIsLoading(false);
    }
  };

  // Verificar OTP
  const handleVerifyOtp = async () => {
    if (otp.length !== 6) {
      setError("Por favor ingresa el código completo de 6 dígitos");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      await authService.verifyOtp(email, otp);
      nextStep();
    } catch (err) {
      setError(err.message || "Código inválido o expirado");
    } finally {
      setIsLoading(false);
    }
  };

  // Crear contraseña
  const handleCreatePassword = async () => {
    if (!password || password.length < 8) {
      setError("La contraseña debe tener al menos 8 caracteres");
      return;
    }

    // Validaciones adicionales
    const hasUpperCase = /[A-Z]/.test(password);
    const hasNumber = /[0-9]/.test(password);

    if (!hasUpperCase) {
      setError("La contraseña debe contener al menos una mayúscula");
      return;
    }

    if (!hasNumber) {
      setError("La contraseña debe contener al menos un número");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      await authService.createPassword(email, password);
      nextStep();
    } catch (err) {
      setError(err.message || "Error al crear la contraseña");
    } finally {
      setIsLoading(false);
    }
  };

  // Reenviar OTP
  const handleResendOtp = async () => {
    setIsLoading(true);
    setError("");
    setOtp(""); // Limpiar el código anterior

    try {
      await authService.sendOtp(email);
      setError(""); // Si quieres mostrar un mensaje de éxito, usa un estado diferente
    } catch (err) {
      setError(err.message || "Error al reenviar el código");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-container">
      {/* Animated background */}
      <div className="bg-gradient"></div>
      <div className="bg-orbs">
        <div className="orb orb-1"></div>
        <div className="orb orb-2"></div>
        <div className="orb orb-3"></div>
      </div>

      {/* Main card */}
      <div className={`auth-card ${isAnimating ? "transitioning" : ""}`}>
        {/* Progress indicator */}
        <div className="progress-bar">
          <div
            className="progress-fill"
            style={{ width: `${(step / 4) * 100}%` }}
          ></div>
        </div>

        {/* Step indicators */}
        <div className="step-indicators">
          {[1, 2, 3, 4].map((num) => (
            <div
              key={num}
              className={`indicator ${step >= num ? "active" : ""} ${step === num ? "current" : ""}`}
            >
              <span>{num}</span>
            </div>
          ))}
        </div>

        {/* Error message */}
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

        {/* Content area */}
        <div className="content-area">
          {/* STEP 1 - EMAIL */}
          {step === 1 && (
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

              <h2 className="step-title">Bienvenido</h2>
              <p className="step-description">
                Ingresa tu correo electrónico para comenzar
              </p>

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
                  onKeyPress={(e) => e.key === "Enter" && handleSendOtp()}
                  disabled={isLoading}
                  autoFocus
                />
              </div>

              <button
                onClick={handleSendOtp}
                className="btn-primary"
                disabled={isLoading || !email}
                style={{ opacity: isLoading || !email ? 0.6 : 1 }}
              >
                <span>{isLoading ? "Enviando..." : "Continuar"}</span>
                {!isLoading && (
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <polyline points="9 18 15 12 9 6" />
                  </svg>
                )}
              </button>
            </div>
          )}

          {/* STEP 2 - OTP */}
          {step === 2 && (
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
                Enviamos un código de 6 dígitos a<br />
                <strong>{email}</strong>
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
                {!isLoading && (
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <polyline points="9 18 15 12 9 6" />
                  </svg>
                )}
              </button>

              <button
                className="btn-link"
                onClick={handleResendOtp}
                disabled={isLoading}
                style={{ opacity: isLoading ? 0.6 : 1 }}
              >
                {isLoading ? "Reenviando..." : "Reenviar código"}
              </button>
            </div>
          )}

          {/* STEP 3 - PASSWORD */}
          {step === 3 && (
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
                  <path d="M12 2a5 5 0 0 0-5 5v3H5a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-8a2 2 0 0 0-2-2h-2V7a5 5 0 0 0-5-5z" />
                  <circle cx="12" cy="16" r="1" />
                </svg>
              </div>

              <h2 className="step-title">Crear contraseña</h2>
              <p className="step-description">
                Elige una contraseña segura para tu cuenta
              </p>

              <div className="input-group">
                <label>Nueva contraseña</label>
                <input
                  type="password"
                  placeholder="••••••••"
                  className="input-field"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setError("");
                  }}
                  onKeyPress={(e) =>
                    e.key === "Enter" && handleCreatePassword()
                  }
                  disabled={isLoading}
                  autoFocus
                />
              </div>

              <div className="password-requirements">
                <div
                  className={`requirement ${password.length >= 8 ? "met" : ""}`}
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
                  className={`requirement ${/[A-Z]/.test(password) ? "met" : ""}`}
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
                  className={`requirement ${/[0-9]/.test(password) ? "met" : ""}`}
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
                onClick={handleCreatePassword}
                className="btn-primary btn-success"
                disabled={isLoading || password.length < 8}
                style={{ opacity: isLoading || password.length < 8 ? 0.6 : 1 }}
              >
                <span>{isLoading ? "Creando..." : "Crear cuenta"}</span>
                {!isLoading && (
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                )}
              </button>
            </div>
          )}

          {/* STEP 4 - SUCCESS */}
          {step === 4 && (
            <div className="step-content fade-in success-screen">
              <div className="success-icon">
                <svg
                  width="64"
                  height="64"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                  <polyline points="22 4 12 14.01 9 11.01" />
                </svg>
              </div>

              <h2 className="step-title">¡Todo listo!</h2>
              <p className="step-description">
                Tu cuenta ha sido creada exitosamente.
                <br />
                Bienvenido a bordo.
              </p>

              <button 
                className="btn-primary btn-wide"
                onClick={() => navigate("/dashboard")}
              >
              <span>Comenzar</span>
              </button>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="card-footer">
          <p>
            ¿Necesitas ayuda? <a href="#">Contacta soporte</a>
          </p>
        </div>
      </div>
    </div>
  );
}

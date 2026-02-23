import { useState } from "react";
import { useNavigate } from "react-router-dom";
import OtpInput from "../../components/OtpInput";
import { authService } from "../../services/authService";

export default function LoginFlow() {
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

  const handleLoginCredentials = async () => {
    if (!email || !email.includes("@")) {
      setError("Por favor ingresa un correo válido");
      return;
    }
    if (!password) {
      setError("Por favor ingresa tu contraseña");
      return;
    }
    setIsLoading(true);
    setError("");
    try {
      await authService.loginCredentials(email, password);
      nextStep();
    } catch (err) {
      setError(err.message || "Correo o contraseña incorrectos");
    } finally {
      setIsLoading(false);
    }
  };

  const handleLoginVerifyOtp = async () => {
    if (otp.length !== 6) {
      setError("Por favor ingresa el código completo de 6 dígitos");
      return;
    }
    setIsLoading(true);
    setError("");
    try {
      await authService.loginVerifyOtp(email, otp);
      nextStep();
    } catch (err) {
      setError(err.message || "Código inválido o expirado");
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

      <div className={`auth-card ${isAnimating ? "transitioning" : ""}`}>
        <div className="progress-bar">
          <div
            className="progress-fill"
            style={{ width: `${(step / 3) * 100}%` }}
          ></div>
        </div>

        <div className="step-indicators">
          {[1, 2, 3].map((num) => (
            <div
              key={num}
              className={`indicator ${step >= num ? "active" : ""} ${step === num ? "current" : ""}`}
            >
              <span>{num}</span>
            </div>
          ))}
        </div>

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
          {/* STEP 1 - CREDENCIALES */}
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
                  onKeyPress={(e) =>
                    e.key === "Enter" && handleLoginCredentials()
                  }
                  disabled={isLoading}
                />
              </div>

              <button
                onClick={handleLoginCredentials}
                className="btn-primary"
                disabled={isLoading || !email || !password}
                style={{ opacity: isLoading || !email || !password ? 0.6 : 1 }}
              >
                <span>{isLoading ? "Verificando..." : "Continuar"}</span>
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
                Enviamos un código a <strong>{email}</strong>
              </p>
              <div className="otp-container">
                <OtpInput value={otp} onChange={setOtp} disabled={isLoading} />
              </div>
              <button
                onClick={handleLoginVerifyOtp}
                className="btn-primary"
                disabled={isLoading || otp.length !== 6}
                style={{ opacity: isLoading || otp.length !== 6 ? 0.6 : 1 }}
              >
                <span>{isLoading ? "Verificando..." : "Verificar código"}</span>
              </button>
            </div>
          )}

          {/* STEP 3 - SUCCESS */}
          {step === 3 && (
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
              <h2 className="step-title">¡Bienvenido!</h2>
              <p className="step-description">Sesión iniciada correctamente.</p>
              <button
                className="btn-primary btn-wide"
                onClick={() => navigate("/dashboard")}
              >
                <span>Ir al dashboard</span>
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

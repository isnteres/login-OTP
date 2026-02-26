import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { authService } from "../../services/authService";

export default function LoginFlow() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async () => {
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
      navigate("/dashboard");
    } catch (err) {
      setError(err.message || "Correo o contraseña incorrectos");
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
                onChange={(e) => { setEmail(e.target.value); setError(""); }}
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
                onChange={(e) => { setPassword(e.target.value); setError(""); }}
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
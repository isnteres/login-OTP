import { useNavigate } from "react-router-dom";

export default function Welcome() {
  const navigate = useNavigate();

  return (
    <div className="auth-container">
      <div className="bg-gradient"></div>
      <div className="bg-orbs">
        <div className="orb orb-1"></div>
        <div className="orb orb-2"></div>
        <div className="orb orb-3"></div>
      </div>

      <div className="auth-card">
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
                <path d="M12 2a5 5 0 0 0-5 5v3H5a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-8a2 2 0 0 0-2-2h-2V7a5 5 0 0 0-5-5z" />
              </svg>
            </div>

            <h2 className="step-title">Bienvenido</h2>
            <p className="step-description">¿Qué deseas hacer hoy?</p>

            <button className="btn-primary" onClick={() => navigate("/login")}>
              <span>Iniciar sesión</span>
            </button>

            <button
              className="btn-primary"
              onClick={() => navigate("/register")}
              style={{
                marginTop: "12px",
                background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
              }}
            >
              <span>Crear cuenta</span>
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

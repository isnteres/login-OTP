import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const navigate = useNavigate();

  const handleLogout = () => {
    navigate("/");
  };

  return (
    <div className="auth-container">
      {/* Animated background*/}
      <div className="bg-gradient"></div>
      <div className="bg-orbs">
        <div className="orb orb-1"></div>
        <div className="orb orb-2"></div>
        <div className="orb orb-3"></div>
      </div>

      {/* Card principal */}
      <div className="auth-card" style={{ maxWidth: "600px" }}>
        <div className="step-content fade-in" style={{ textAlign: "center" }}>
          {/* Icono de éxito */}
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

          {/* Título */}
          <h1 className="step-title" style={{ marginBottom: "16px" }}>
            Bienvenido a
          </h1>
          <h2
            className="step-title"
            style={{
              background: "linear-gradient(135deg, #6366f1, #10b981)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              marginBottom: "24px",
            }}
          >
            Calidad de Software
          </h2>

          {/* Descripción */}
          <p className="step-description" style={{ marginBottom: "32px" }}>
            Has iniciado sesión exitosamente.
            <br />
            Tu cuenta está lista para usar.
          </p>

          {/* Botones */}
          <div
            style={{ display: "flex", gap: "12px", flexDirection: "column" }}
          >
            <button onClick={() => navigate("/audit")} className="btn-primary">
              🛡️ Panel de Auditoría
            </button>

            <button
              onClick={handleLogout}
              className="btn-link"
              style={{ marginTop: "8px" }}
            >
              Cerrar sesión
            </button>
          </div>
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

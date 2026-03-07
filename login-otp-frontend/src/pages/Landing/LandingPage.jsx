import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getCursos, registrarClick } from "../../api/cursosApi";

const ICONOS = ["⚛️", "🎨", "📱", "🔷", "🐘", "🐍", "☕", "🦀"];

function Toast({ toasts }) {
  return (
    <div style={{ position: "fixed", top: "1.5rem", right: "1.5rem", zIndex: 9999, display: "flex", flexDirection: "column", gap: "0.5rem" }}>
      {toasts.map((t) => (
        <div key={t.id} style={{
          background: t.tipo === "comprar" ? "linear-gradient(135deg,#6366f1,#4f46e5)" : "rgba(30,41,59,0.95)",
          border: `1px solid ${t.tipo === "comprar" ? "rgba(99,102,241,0.5)" : "rgba(255,255,255,0.1)"}`,
          color: "#f8fafc", padding: "0.75rem 1.2rem", borderRadius: "12px",
          fontSize: "0.85rem", fontWeight: 600, boxShadow: "0 8px 32px rgba(0,0,0,0.4)",
          maxWidth: "300px", fontFamily: "'DM Sans', sans-serif", animation: "slideIn 0.3s ease",
        }}>
          {t.tipo === "comprar" ? "🎓 " : "👁 "}{t.mensaje}
        </div>
      ))}
    </div>
  );
}

export default function LandingPage() {
  const navigate = useNavigate();
  const [cursos, setCursos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toasts, setToasts] = useState([]);
  const [filtro, setFiltro] = useState("Todos");

  useEffect(() => {
    getCursos()
      .then((res) => setCursos(res.data))
      .finally(() => setLoading(false));
  }, []);

  const showToast = (mensaje, tipo = "ver") => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, mensaje, tipo }]);
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 2500);
  };

  const handleVer = async (curso) => {
    await registrarClick({ course_id: curso.id, tipo_evento: "click_ver", seccion: "catalogo" });
    showToast(`Viendo: ${curso.title}`, "ver");
  };

  const handleComprar = async (curso) => {
    await registrarClick({ course_id: curso.id, tipo_evento: "click_comprar", seccion: "catalogo" });
    showToast(`¡Inscrito: ${curso.title}!`, "comprar");
  };

  const categorias = ["Todos", "Tecnología y Desarrollo", "Redes y Ciberseguridad"];
  const cursosFiltrados = filtro === "Todos" ? cursos : cursos.filter((c) => c.category === filtro);

  return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(135deg,#0c1220,#111827,#0c1220)", fontFamily: "'DM Sans', sans-serif", position: "relative" }}>

      {/* Orbs de fondo */}
      <div style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0 }}>
        <div style={{ position: "absolute", width: "500px", height: "500px", borderRadius: "50%", background: "rgba(99,102,241,0.06)", filter: "blur(120px)", top: "-100px", left: "10%" }} />
        <div style={{ position: "absolute", width: "400px", height: "400px", borderRadius: "50%", background: "rgba(16,185,129,0.04)", filter: "blur(100px)", bottom: 0, right: "10%" }} />
      </div>

      <Toast toasts={toasts} />

      {/* ── Navbar ── */}
      <nav style={{
        position: "sticky", top: 0, zIndex: 100,
        background: "rgba(8,12,25,0.85)", backdropFilter: "blur(20px)",
        borderBottom: "1px solid rgba(255,255,255,0.06)",
        padding: "0 40px", height: "60px",
        display: "flex", alignItems: "center", justifyContent: "space-between",
      }}>
        {/* Logo */}
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <span style={{ fontSize: "1.2rem" }}>🎓</span>
          <div>
            <p style={{ color: "#f8fafc", fontWeight: 700, fontSize: "14px", margin: 0, lineHeight: 1.2 }}>DevCourses</p>
            <p style={{ color: "rgba(255,255,255,0.3)", fontSize: "11px", margin: 0 }}>Aprende programación</p>
          </div>
        </div>

        {/* Botones navbar */}
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          {/* Registro — nuevo */}
          <button
            onClick={() => navigate("/register")}
            style={{
              padding: "8px 18px", borderRadius: "10px",
              background: "transparent",
              border: "1px solid rgba(99,102,241,0.4)",
              color: "#a5b4fc", fontWeight: 600, fontSize: "13px",
              cursor: "pointer", fontFamily: "'DM Sans', sans-serif",
              transition: "all 0.2s",
            }}
            onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(99,102,241,0.1)"; e.currentTarget.style.transform = "translateY(-1px)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.transform = "translateY(0)"; }}
          >
            Registrarse
          </button>

          {/* Login */}
          <button
            onClick={() => navigate("/login")}
            style={{
              padding: "8px 20px", borderRadius: "10px",
              background: "linear-gradient(135deg,#6366f1,#4f46e5)",
              border: "none", color: "#fff", fontWeight: 600, fontSize: "13px",
              cursor: "pointer", fontFamily: "'DM Sans', sans-serif",
              boxShadow: "0 4px 16px rgba(99,102,241,0.3)", transition: "all 0.2s",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.transform = "translateY(-1px)")}
            onMouseLeave={(e) => (e.currentTarget.style.transform = "translateY(0)")}
          >
            Iniciar sesión
          </button>
        </div>
      </nav>

      {/* ── Hero ── */}
      <div style={{ textAlign: "center", padding: "5rem 2rem 3rem", position: "relative", zIndex: 1 }}>
        <span style={{
          display: "inline-block", marginBottom: "1rem",
          background: "rgba(99,102,241,0.1)", border: "1px solid rgba(99,102,241,0.2)",
          color: "#a5b4fc", borderRadius: "20px", padding: "4px 16px",
          fontSize: "12px", fontWeight: 700, letterSpacing: "1px", textTransform: "uppercase",
        }}>
          Plataforma de cursos online
        </span>

        <h1 style={{
          color: "#f8fafc", fontSize: "clamp(2rem, 5vw, 3.5rem)", fontWeight: 700,
          margin: "0 0 1rem", fontFamily: "'Playfair Display', serif",
          letterSpacing: "-1px", lineHeight: 1.2,
        }}>
          Aprende a programar{" "}
          <span style={{ background: "linear-gradient(135deg,#6366f1,#10b981)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
            desde cero
          </span>
        </h1>

        <p style={{ color: "rgba(255,255,255,0.4)", fontSize: "1.1rem", maxWidth: "520px", margin: "0 auto 2rem", lineHeight: 1.6 }}>
          Cursos diseñados por profesionales para llevarte de principiante a experto en tecnología.
        </p>

        {/* CTA del hero */}
        <div style={{ display: "flex", gap: "12px", justifyContent: "center", flexWrap: "wrap" }}>
          <button
            onClick={() => navigate("/register")}
            style={{
              padding: "12px 28px", borderRadius: "12px",
              background: "linear-gradient(135deg,#6366f1,#4f46e5)",
              border: "none", color: "#fff", fontWeight: 700, fontSize: "15px",
              cursor: "pointer", fontFamily: "'DM Sans', sans-serif",
              boxShadow: "0 4px 24px rgba(99,102,241,0.4)", transition: "all 0.2s",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.transform = "translateY(-2px)")}
            onMouseLeave={(e) => (e.currentTarget.style.transform = "translateY(0)")}
          >
            Empezar gratis →
          </button>
          <button
            onClick={() => navigate("/login")}
            style={{
              padding: "12px 28px", borderRadius: "12px",
              background: "transparent", border: "1px solid rgba(255,255,255,0.15)",
              color: "rgba(255,255,255,0.7)", fontWeight: 600, fontSize: "15px",
              cursor: "pointer", fontFamily: "'DM Sans', sans-serif", transition: "all 0.2s",
            }}
            onMouseEnter={(e) => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.3)"; e.currentTarget.style.color = "#fff"; }}
            onMouseLeave={(e) => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.15)"; e.currentTarget.style.color = "rgba(255,255,255,0.7)"; }}
          >
            Ya tengo cuenta
          </button>
        </div>
      </div>

      {/* ── Catálogo ── */}
      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 2rem 4rem", position: "relative", zIndex: 1 }}>

        {/* Filtros */}
        <div style={{ display: "flex", gap: "8px", marginBottom: "2rem", flexWrap: "wrap" }}>
          {categorias.map((cat) => (
            <button
              key={cat}
              onClick={() => setFiltro(cat)}
              style={{
                padding: "6px 16px", borderRadius: "20px", fontSize: "13px", fontWeight: 600,
                cursor: "pointer", fontFamily: "'DM Sans', sans-serif", transition: "all 0.15s",
                background: filtro === cat ? "rgba(99,102,241,0.2)" : "transparent",
                border: filtro === cat ? "1px solid rgba(99,102,241,0.5)" : "1px solid rgba(255,255,255,0.1)",
                color: filtro === cat ? "#a5b4fc" : "rgba(255,255,255,0.4)",
              }}
            >
              {cat}
            </button>
          ))}
        </div>

        {loading ? (
          <div style={{ textAlign: "center", color: "rgba(255,255,255,0.3)", padding: "4rem" }}>Cargando cursos...</div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "20px" }}>
            {cursosFiltrados.map((curso, i) => (
              <div key={curso.id} style={{
                background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)",
                borderRadius: "16px", padding: "20px", display: "flex", flexDirection: "column", gap: "12px",
                transition: "all 0.2s", cursor: "default",
              }}
                onMouseEnter={(e) => { e.currentTarget.style.border = "1px solid rgba(99,102,241,0.3)"; e.currentTarget.style.transform = "translateY(-2px)"; }}
                onMouseLeave={(e) => { e.currentTarget.style.border = "1px solid rgba(255,255,255,0.07)"; e.currentTarget.style.transform = "translateY(0)"; }}
              >
                {/* Icono + badge */}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div style={{
                    width: "52px", height: "52px", borderRadius: "14px",
                    background: "linear-gradient(135deg,rgba(99,102,241,0.2),rgba(139,92,246,0.2))",
                    border: "1px solid rgba(99,102,241,0.2)",
                    display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.6rem",
                  }}>
                    {ICONOS[i % ICONOS.length]}
                  </div>
                  <span style={{
                    background: "rgba(16,185,129,0.1)", color: "#10b981",
                    border: "1px solid rgba(16,185,129,0.2)", borderRadius: "20px",
                    padding: "3px 10px", fontSize: "11px", fontWeight: 700,
                  }}>
                    {curso.category}
                  </span>
                </div>

                <h3 style={{ color: "#f8fafc", margin: 0, fontSize: "0.95rem", fontWeight: 700 }}>{curso.title}</h3>
                <p style={{ color: "rgba(255,255,255,0.35)", margin: 0, fontSize: "0.8rem", lineHeight: 1.5 }}>{curso.description}</p>

                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <span style={{ color: "#a5b4fc", fontWeight: 900, fontSize: "1.2rem" }}>S/. {curso.price}</span>
                  <span style={{ color: "rgba(255,255,255,0.2)", fontSize: "11px" }}>{curso.studentsCount} estudiantes</span>
                </div>

                <div style={{ display: "flex", gap: "8px", marginTop: "auto" }}>
                  <button onClick={() => handleVer(curso)} style={{
                    flex: 1, padding: "8px", borderRadius: "10px",
                    background: "transparent", border: "1px solid rgba(99,102,241,0.3)",
                    color: "#a5b4fc", fontWeight: 600, cursor: "pointer", fontSize: "12px",
                    fontFamily: "'DM Sans', sans-serif", transition: "all 0.15s",
                  }}>
                    Ver más
                  </button>
                  <button onClick={() => handleComprar(curso)} style={{
                    flex: 1, padding: "8px", borderRadius: "10px",
                    background: "linear-gradient(135deg,#6366f1,#4f46e5)",
                    border: "none", color: "#fff", fontWeight: 600, cursor: "pointer", fontSize: "12px",
                    fontFamily: "'DM Sans', sans-serif", boxShadow: "0 4px 16px rgba(99,102,241,0.3)",
                    transition: "all 0.15s",
                  }}>
                    Inscribirse
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ── Footer ── */}
      <div style={{ borderTop: "1px solid rgba(255,255,255,0.06)", padding: "2rem 40px", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "12px", position: "relative", zIndex: 1 }}>
        <p style={{ color: "rgba(255,255,255,0.2)", fontSize: "13px", margin: 0 }}>© 2026 DevCourses. Todos los derechos reservados.</p>
        <div style={{ display: "flex", gap: "16px" }}>
          <button onClick={() => navigate("/register")} style={{ background: "none", border: "none", color: "rgba(255,255,255,0.3)", fontSize: "13px", cursor: "pointer", fontFamily: "'DM Sans', sans-serif" }}>Crear cuenta</button>
          <button onClick={() => navigate("/login")} style={{ background: "none", border: "none", color: "rgba(255,255,255,0.3)", fontSize: "13px", cursor: "pointer", fontFamily: "'DM Sans', sans-serif" }}>Iniciar sesión</button>
        </div>
      </div>

      <style>{`
        @keyframes slideIn { from { opacity: 0; transform: translateX(20px); } to { opacity: 1; transform: translateX(0); } }
      `}</style>
    </div>
  );
}
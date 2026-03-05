import RrhhTabs from "../../components/ui/RrhhTabs"

export function DesempenoPage({ setActive }) {
  return (
    <div style={{ padding: "22px 26px", fontFamily: "'DM Sans', sans-serif" }}>
      <RrhhTabs mainTab="rrhh" subTab="desempeno" setActive={setActive} />
      <h1 style={{ color: "white", fontSize: "18px", fontWeight: "700", marginBottom: "6px" }}>Desempeño</h1>
      <Placeholder />
    </div>
  )
}

export function ObjetivosPage({ setActive }) {
  return (
    <div style={{ padding: "22px 26px", fontFamily: "'DM Sans', sans-serif" }}>
      <RrhhTabs mainTab="rrhh" subTab="objetivos" setActive={setActive} />
      <h1 style={{ color: "white", fontSize: "18px", fontWeight: "700", marginBottom: "6px" }}>Objetivos</h1>
      <Placeholder />
    </div>
  )
}

export function SoportePage({ setActive }) {
  return (
    <div style={{ padding: "22px 26px", fontFamily: "'DM Sans', sans-serif" }}>
      <RrhhTabs mainTab="soporte" subTab="" setActive={setActive} />
      <h1 style={{ color: "white", fontSize: "18px", fontWeight: "700", marginBottom: "6px" }}>Soporte</h1>
      <Placeholder />
    </div>
  )
}

export function ComunidadPage({ setActive }) {
  return (
    <div style={{ padding: "22px 26px", fontFamily: "'DM Sans', sans-serif" }}>
      <RrhhTabs mainTab="comunidad" subTab="" setActive={setActive} />
      <h1 style={{ color: "white", fontSize: "18px", fontWeight: "700", marginBottom: "6px" }}>Comunidad</h1>
      <Placeholder />
    </div>
  )
}

function Placeholder() {
  return (
    <div style={{ background: "rgba(255,255,255,0.03)", borderRadius: "12px", border: "1px solid rgba(255,255,255,0.06)", padding: "60px", textAlign: "center", marginTop: "16px" }}>
      <p style={{ color: "rgba(255,255,255,0.18)", fontSize: "14px", margin: 0 }}>🚧 Módulo en construcción</p>
    </div>
  )
}

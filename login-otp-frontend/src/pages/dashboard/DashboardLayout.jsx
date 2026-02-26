import { useState } from "react"
import {
  FiUsers, FiShield, FiActivity,
  FiChevronDown, FiLogOut,
} from "react-icons/fi"

import { useSuperAdmin }        from "../../hooks/useSuperAdmin"
import SuperAdminGate           from "../../components/ui/SuperAdminGate"
import PersonalPage             from "./crm/personal/PersonalPage"
import AuditoriaRrhhPage        from "./crm/auditoria/AuditoriaRrhhPage"
import AnaliticaPage            from "./sistema/analitica/AnaliticaPage"
import AuditoriaSistemaPage     from "./sistema/auditoria/AuditoriaSistemaPage"
import { DesempenoPage, ObjetivosPage, SoportePage, ComunidadPage } from "./Placeholders"

// Sidebar
function Sidebar({ active, setActive, granted, onLogout }) {
  const [openCRM,  setOpenCRM]  = useState(true)
  const [openSist, setOpenSist] = useState(true)

  const isActive = (id) => active === id || active === id + "_gate"

  const SectionHeader = ({ label, isOpen, toggle }) => (
    <button onClick={toggle} style={{
      width: "100%", display: "flex", alignItems: "center",
      justifyContent: "space-between", background: "transparent",
      border: "none", cursor: "pointer", padding: "14px 12px 6px",
      color: "rgba(255,255,255,0.2)", fontFamily: "'DM Sans', sans-serif",
      fontSize: "10px", fontWeight: "700", textTransform: "uppercase",
      letterSpacing: "0.1em",
    }}>
      {label}
      <FiChevronDown
        size={12}
        style={{
          transition: "transform 0.2s",
          transform: isOpen ? "rotate(0deg)" : "rotate(-90deg)",
          opacity: 0.45,
        }}
      />
    </button>
  )

  const NavItem = ({ id, label, icon, needsAuth = false }) => {
    const active_ = isActive(id)
    const handleClick = () => {
      if (needsAuth && !granted(id)) setActive(id + "_gate")
      else setActive(id)
    }
    return (
      <button
        onClick={handleClick}
        style={{
          width: "100%", display: "flex", alignItems: "center",
          gap: "9px", padding: "8px 12px", borderRadius: "7px",
          border: "none", cursor: "pointer", marginBottom: "2px",
          fontFamily: "'DM Sans', sans-serif", fontSize: "13px",
          fontWeight: active_ ? "600" : "400",
          background: active_ ? "rgba(99,102,241,0.14)" : "transparent",
          color: active_ ? "#a5b4fc" : "rgba(255,255,255,0.5)",
          borderLeft: active_ ? "2px solid #6366f1" : "2px solid transparent",
          transition: "all 0.12s",
        }}
        onMouseEnter={e => { if (!active_) e.currentTarget.style.background = "rgba(255,255,255,0.05)" }}
        onMouseLeave={e => { if (!active_) e.currentTarget.style.background = "transparent" }}
      >
        <span style={{ opacity: 0.65, flexShrink: 0, display: "flex" }}>{icon}</span>
        {label}
      </button>
    )
  }

  return (
    <aside style={{
      width: "220px", minHeight: "100vh",
      background: "rgba(8,12,25,0.98)",
      borderRight: "1px solid rgba(255,255,255,0.06)",
      display: "flex", flexDirection: "column", flexShrink: 0,
    }}>
      {/* Logo */}
      <div style={{ padding: "18px 14px 14px", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "9px" }}>
          {/*<div style={{
            width: "30px", height: "30px", borderRadius: "8px",
            background: "linear-gradient(135deg,#6366f1,#10b981)",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <FiShield size={14} color="white" />
          </div>*/}
          <div>
            <p style={{ color: "white", fontWeight: "700", fontSize: "13px", margin: 0, lineHeight: 1.2 }}>Dashboard</p>
            <p style={{ color: "rgba(255,255,255,0.3)", fontSize: "11px", margin: 0 }}>Panel de Administración</p>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav style={{ padding: "4px 8px", flex: 1 }}>
        <SectionHeader label="Comercial (CRM)" isOpen={openCRM} toggle={() => setOpenCRM(p => !p)} />
        {openCRM && <NavItem id="crm" label="CRM" icon={<FiUsers size={14} />} />}

        <SectionHeader label="Sistema y Seguridad" isOpen={openSist} toggle={() => setOpenSist(p => !p)} />
        {openSist && (
          <>
            <NavItem id="sistema_analitica" label="Analítica Web" icon={<FiActivity size={14} />} needsAuth />
            <NavItem id="sistema_auditoria" label="Auditoría"     icon={<FiShield size={14} />}   needsAuth />
          </>
        )}
      </nav>

      {/* Logout */}
      <div style={{ padding: "10px 8px", borderTop: "1px solid rgba(255,255,255,0.05)" }}>
        <button
          onClick={onLogout}
          style={{
            width: "100%", display: "flex", alignItems: "center",
            gap: "9px", padding: "8px 12px", borderRadius: "7px",
            border: "none", cursor: "pointer", background: "transparent",
            color: "rgba(255,255,255,0.28)", fontFamily: "'DM Sans', sans-serif",
            fontSize: "13px", transition: "all 0.12s",
          }}
          onMouseEnter={e => { e.currentTarget.style.color = "#f87171"; e.currentTarget.style.background = "rgba(239,68,68,0.07)" }}
          onMouseLeave={e => { e.currentTarget.style.color = "rgba(255,255,255,0.28)"; e.currentTarget.style.background = "transparent" }}
        >
          <FiLogOut size={14} /> Cerrar sesión
        </button>
      </div>
    </aside>
  )
}

// Renderizado de páginas
function renderPage(active, setActive, superAdmin) {
  if (active === "sistema_analitica_gate") {
    return <SuperAdminGate verify={superAdmin.verify} onSuccess={() => { superAdmin.grant("sistema_analitica"); setActive("sistema_analitica") }} />
  }
  if (active === "sistema_auditoria_gate") {
    return <SuperAdminGate verify={superAdmin.verify} onSuccess={() => { superAdmin.grant("sistema_auditoria"); setActive("sistema_auditoria") }} />
  }

  switch (active) {
    case "crm":
    case "crm_rrhh_personal":   return <PersonalPage      setActive={setActive} />
    case "crm_rrhh_desempeno":  return <DesempenoPage     setActive={setActive} />
    case "crm_rrhh_objetivos":  return <ObjetivosPage     setActive={setActive} />
    case "crm_rrhh_auditoria":  return <AuditoriaRrhhPage setActive={setActive} />
    case "crm_soporte":         return <SoportePage       setActive={setActive} />
    case "crm_comunidad":       return <ComunidadPage     setActive={setActive} />
    case "sistema_analitica":   return <AnaliticaPage />
    case "sistema_auditoria":   return <AuditoriaSistemaPage />
    default:                    return <PersonalPage setActive={setActive} />
  }
}

// Layout principal 
export default function DashboardLayout({ onLogout }) {
  const [active, setActive] = useState("crm")
  const superAdmin = useSuperAdmin()

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "linear-gradient(135deg,#0c1220,#111827,#0c1220)" }}>
      <div style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0 }}>
        <div style={{ position: "absolute", width: "500px", height: "500px", borderRadius: "50%", background: "rgba(99,102,241,0.05)", filter: "blur(120px)", top: "-100px", left: "120px" }} />
        <div style={{ position: "absolute", width: "400px", height: "400px", borderRadius: "50%", background: "rgba(16,185,129,0.04)", filter: "blur(100px)", bottom: 0, right: "150px" }} />
      </div>

      <div style={{ position: "sticky", top: 0, height: "100vh", zIndex: 10 }}>
        <Sidebar active={active} setActive={setActive} granted={superAdmin.isGranted} onLogout={onLogout} />
      </div>

      <main style={{ flex: 1, overflowY: "auto", position: "relative", zIndex: 1 }}>
        {renderPage(active, setActive, superAdmin)}
      </main>
    </div>
  )
}

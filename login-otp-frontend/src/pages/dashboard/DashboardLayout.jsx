import { useState } from "react";
import {
  FiUsers,
  FiShield,
  FiActivity,
  FiChevronDown,
  FiLogOut,
  FiHome,
  FiBookOpen,
} from "react-icons/fi";

// --- IMPORTS BASE DEL SISTEMA ---
import { useSuperAdmin } from "../../hooks/useSuperAdmin";
import SuperAdminGate from "../../components/ui/SuperAdminGate";
import PersonalPage from "./crm/personal/PersonalPage";
import AuditoriaRrhhPage from "./crm/auditoria/AuditoriaRrhhPage";
import AnaliticaPage from "./sistema/analitica/AnaliticaPage";
import AuditoriaSistemaPage from "./sistema/auditoria/AuditoriaSistemaPage";
import { DesempenoPage, ObjetivosPage, SoportePage, ComunidadPage } from "./Placeholders";

// --- IMPORTS DE INTEGRANTES (COEXISTENCIA TOTAL) ---
import InicioPage from './panel/InicioPage'; // Adrian (Int 4)
import CursosPage from "./operaciones/cursos/CursosPage"; // Dayana
import CursosAnalitica from "./sistema/analitica/CursosAnalitica"; // Julio (Int 3)

function Sidebar({ active, setActive, granted, onLogout }) {
  const [openPanel, setOpenPanel] = useState(true);
  const [openCRM, setOpenCRM] = useState(true);
  const [openOps, setOpenOps] = useState(true);
  const [openSist, setOpenSist] = useState(true);

  const isActive = (id) => active === id || active === id + "_gate";

  const SectionHeader = ({ label, isOpen, toggle }) => (
    <button
      onClick={toggle}
      style={{
        width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between",
        background: "transparent", border: "none", cursor: "pointer", padding: "14px 12px 6px",
        color: "rgba(255,255,255,0.2)", fontFamily: "'DM Sans', sans-serif", fontSize: "10px",
        fontWeight: "700", textTransform: "uppercase", letterSpacing: "0.1em",
      }}
    >
      {label}
      <FiChevronDown size={12} style={{ transition: "transform 0.2s", transform: isOpen ? "rotate(0deg)" : "rotate(-90deg)", opacity: 0.45 }} />
    </button>
  );

  const NavItem = ({ id, label, icon, needsAuth = false }) => {
    const active_ = isActive(id);
    const handleClick = () => {
      if (needsAuth && !granted(id)) setActive(id + "_gate");
      else setActive(id);
    };
    return (
      <button
        onClick={handleClick}
        style={{
          width: "100%", display: "flex", alignItems: "center", gap: "9px", padding: "8px 12px",
          borderRadius: "7px", border: "none", cursor: "pointer", marginBottom: "2px",
          fontFamily: "'DM Sans', sans-serif", fontSize: "13px", fontWeight: active_ ? "600" : "400",
          background: active_ ? "rgba(99,102,241,0.14)" : "transparent",
          color: active_ ? "#a5b4fc" : "rgba(255,255,255,0.5)",
          borderLeft: active_ ? "2px solid #6366f1" : "2px solid transparent",
          transition: "all 0.12s",
        }}
      >
        <span style={{ opacity: 0.65, flexShrink: 0, display: "flex" }}>{icon}</span>
        {label}
      </button>
    );
  };

  return (
    <aside style={{ width: "220px", minHeight: "100vh", background: "rgba(8,12,25,0.98)", borderRight: "1px solid rgba(255,255,255,0.06)", display: "flex", flexDirection: "column", flexShrink: 0 }}>
      <div style={{ padding: "18px 14px 14px", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
        <p style={{ color: "white", fontWeight: "700", fontSize: "13px", margin: 0 }}>Dashboard</p>
        <p style={{ color: "rgba(255,255,255,0.3)", fontSize: "11px", margin: 0 }}>Maquimpower Admin</p>
      </div>

      <nav style={{ padding: "4px 8px", flex: 1 }}>
        <SectionHeader label="Panel" isOpen={openPanel} toggle={() => setOpenPanel(p => !p)} />
        {openPanel && <NavItem id="panel_inicio" label="Inicio" icon={<FiHome size={14} />} />}

        <SectionHeader label="Comercial (CRM)" isOpen={openCRM} toggle={() => setOpenCRM(p => !p)} />
        {openCRM && (
          <>
            <NavItem id="crm_rrhh_personal" label="Personal" icon={<FiUsers size={14} />} />
            <NavItem id="crm_soporte" label="Soporte" icon={<FiActivity size={14} />} />
          </>
        )}

        <SectionHeader label="Operaciones" isOpen={openOps} toggle={() => setOpenOps(p => !p)} />
        {openOps && (
          <>
            <NavItem id="operaciones_cursos" label="Cursos Online" icon={<FiBookOpen size={14} />} />
            <NavItem id="operaciones_analitica" label="Analítica Cursos" icon={<FiActivity size={14} />} />
          </>
        )}

        <SectionHeader label="Sistema" isOpen={openSist} toggle={() => setOpenSist(p => !p)} />
        {openSist && (
          <>
            <NavItem id="sistema_analitica" label="Analítica Web" icon={<FiActivity size={14} />} needsAuth />
            <NavItem id="sistema_auditoria" label="Auditoría" icon={<FiShield size={14} />} needsAuth />
          </>
        )}
      </nav>

      <div style={{ padding: "10px 8px", borderTop: "1px solid rgba(255,255,255,0.05)" }}>
        <button onClick={onLogout} style={{ width: "100%", display: "flex", alignItems: "center", gap: "9px", padding: "8px 12px", borderRadius: "7px", border: "none", cursor: "pointer", background: "transparent", color: "rgba(255,255,255,0.28)", fontSize: "13px" }}>
          <FiLogOut size={14} /> Cerrar sesión
        </button>
      </div>
    </aside>
  );
}

function renderPage(active, setActive, superAdmin) {
  if (active.includes("_gate")) {
    const target = active.replace("_gate", "");
    return <SuperAdminGate verify={superAdmin.verify} onSuccess={() => { superAdmin.grant(target); setActive(target) }} />;
  }

  switch (active) {
    case "panel_inicio":         return <InicioPage />;
    
    // CRM
    case "crm":
    case "crm_rrhh_personal":    return <PersonalPage setActive={setActive} />;
    case "crm_rrhh_desempeno":   return <DesempenoPage setActive={setActive} />;
    case "crm_rrhh_objetivos":   return <ObjetivosPage setActive={setActive} />;
    case "crm_rrhh_auditoria":   return <AuditoriaRrhhPage setActive={setActive} />;
    case "crm_soporte":          return <SoportePage setActive={setActive} />;
    case "crm_comunidad":        return <ComunidadPage setActive={setActive} />;
    
    // OPERACIONES
    case "operaciones_cursos":   return <CursosPage />;
    case "operaciones_analitica": return <CursosAnalitica />;
    
    // SISTEMA
    case "sistema_analitica":    return <AnaliticaPage />;
    case "sistema_auditoria":    return <AuditoriaSistemaPage />;
    
    default:                     return <InicioPage />;
  }
}

export default function DashboardLayout({ onLogout }) {
  const [active, setActive] = useState("panel_inicio");
  const superAdmin = useSuperAdmin();

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "linear-gradient(135deg,#0c1220,#111827,#0c1220)" }}>
      {/* Efectos de fondo */}
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
  );
}
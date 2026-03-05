const PersonIcon  = () => <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
const TrendIcon   = () => <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/></svg>
const TargetIcon  = () => <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>
const ShieldIcon  = () => <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
const HeadIcon    = () => <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 18v-6a9 9 0 0 1 18 0v6"/><path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z"/></svg>
const ChatIcon    = () => <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>

const MAIN_TABS = [
  { id: "rrhh",      label: "Recursos Humanos", icon: <PersonIcon />, target: "crm_rrhh_personal" },
  { id: "soporte",   label: "Soporte",           icon: <HeadIcon />,  target: "crm_soporte" },
  { id: "comunidad", label: "Comunidad",          icon: <ChatIcon />,  target: "crm_comunidad" },
]

const SUB_TABS = [
  { id: "personal",  label: "Personal",  icon: <PersonIcon />,  target: "crm_rrhh_personal" },
  { id: "desempeno", label: "Desempeño", icon: <TrendIcon />,   target: "crm_rrhh_desempeno" },
  { id: "objetivos", label: "Objetivos", icon: <TargetIcon />,  target: "crm_rrhh_objetivos" },
  { id: "auditoria", label: "Auditoría", icon: <ShieldIcon />,  target: "crm_rrhh_auditoria" },
]

const tabStyle = (active) => ({
  padding: "9px 20px", border: "none", cursor: "pointer", background: "transparent",
  color: active ? "#a5b4fc" : "rgba(255,255,255,0.35)",
  borderBottom: active ? "2px solid #6366f1" : "2px solid transparent",
  fontFamily: "'DM Sans', sans-serif", fontSize: "14px",
  fontWeight: active ? "600" : "400", marginBottom: "-1px", transition: "all 0.15s",
  display: "flex", alignItems: "center", gap: "6px",
})

export default function RrhhTabs({ mainTab, subTab, setActive }) {
  return (
    <>
      <div style={{ display: "flex", borderBottom: "1px solid rgba(255,255,255,0.07)", marginBottom: "14px" }}>
        {MAIN_TABS.map(t => (
          <button key={t.id} onClick={() => setActive(t.target)} style={tabStyle(mainTab === t.id)}>
            <span style={{ opacity: 0.6 }}>{t.icon}</span>{t.label}
          </button>
        ))}
      </div>

      {mainTab === "rrhh" && (
        <div style={{ display: "flex", borderBottom: "1px solid rgba(255,255,255,0.05)", marginBottom: "20px" }}>
          {SUB_TABS.map(t => (
            <button key={t.id} onClick={() => setActive(t.target)} style={{ ...tabStyle(subTab === t.id), fontSize: "13px", padding: "7px 18px" }}>
              <span style={{ opacity: 0.6 }}>{t.icon}</span>{t.label}
            </button>
          ))}
        </div>
      )}
    </>
  )
}

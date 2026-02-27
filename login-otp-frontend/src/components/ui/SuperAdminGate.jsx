import { useState } from "react"

const EyeIcon = ({ open }) => open
  ? <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
  : <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>

export default function SuperAdminGate({ onSuccess, verify }) {
  const [pwd, setPwd]     = useState("")
  const [show, setShow]   = useState(false)
  const [error, setError] = useState("")
  const [shake, setShake] = useState(false)

  const handleSubmit = () => {
    if (verify(pwd)) {
      onSuccess()
    } else {
      setError("Contraseña incorrecta")
      setShake(true)
      setTimeout(() => setShake(false), 500)
      setPwd("")
    }
  }

  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "100%", padding: "60px 20px", fontFamily: "'DM Sans', sans-serif" }}>
      <style>{`@keyframes shake{0%,100%{transform:translateX(0)}20%,60%{transform:translateX(-8px)}40%,80%{transform:translateX(8px)}}`}</style>
      <div style={{ background: "rgba(255,255,255,0.04)", borderRadius: "18px", border: "1px solid rgba(255,255,255,0.09)", padding: "40px 36px", width: "100%", maxWidth: "380px", textAlign: "center", animation: shake ? "shake 0.4s ease" : "none" }}>
        <div style={{ width: "54px", height: "54px", borderRadius: "16px", background: "rgba(99,102,241,0.12)", border: "1px solid rgba(99,102,241,0.25)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px", color: "#818cf8" }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
        </div>
        <h2 style={{ color: "white", fontSize: "18px", fontWeight: "700", margin: "0 0 6px" }}>Acceso Restringido</h2>
        <p style={{ color: "rgba(255,255,255,0.4)", fontSize: "13px", margin: "0 0 24px", lineHeight: 1.5 }}>Esta sección requiere autenticación<br />de Super Administrador</p>
        {error && (
          <div style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.3)", borderRadius: "8px", padding: "9px 14px", marginBottom: "14px", color: "#f87171", fontSize: "13px" }}>
            {error}
          </div>
        )}
        <div style={{ position: "relative", marginBottom: "14px" }}>
          <input
            type={show ? "text" : "password"}
            placeholder="Contraseña de Super Admin"
            value={pwd}
            onChange={e => { setPwd(e.target.value); setError("") }}
            onKeyDown={e => e.key === "Enter" && handleSubmit()}
            autoFocus
            style={{ width: "100%", padding: "11px 42px 11px 14px", borderRadius: "10px", border: `1px solid ${error ? "rgba(239,68,68,0.4)" : "rgba(255,255,255,0.1)"}`, background: "rgba(255,255,255,0.05)", color: "white", fontSize: "14px", fontFamily: "'DM Sans', sans-serif", outline: "none", boxSizing: "border-box" }}
          />
          <button onClick={() => setShow(s => !s)} style={{ position: "absolute", right: "12px", top: "50%", transform: "translateY(-50%)", background: "transparent", border: "none", cursor: "pointer", color: "rgba(255,255,255,0.35)", display: "flex", alignItems: "center" }}>
            <EyeIcon open={show} />
          </button>
        </div>
        <button onClick={handleSubmit} style={{ width: "100%", padding: "11px", borderRadius: "10px", border: "none", background: "linear-gradient(135deg,#6366f1,#4f46e5)", color: "white", fontFamily: "'DM Sans', sans-serif", fontSize: "14px", fontWeight: "600", cursor: "pointer", boxShadow: "0 4px 14px rgba(99,102,241,0.3)" }}>
          Acceder
        </button>
      </div>
    </div>
  )
}

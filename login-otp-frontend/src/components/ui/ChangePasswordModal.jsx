import { useState } from "react"
import {
  FiLock, FiEye, FiEyeOff, FiInfo,
  FiCheck, FiCheckCircle, FiAlertCircle,
} from "react-icons/fi"
import { authService } from "../../services/authService"

const rules = [
  { id: "length",  label: "Al menos 8 caracteres",            test: (p) => p.length >= 8 },
  { id: "lower",   label: "Una letra minúscula",              test: (p) => /[a-z]/.test(p) },
  { id: "upper",   label: "Una letra mayúscula",              test: (p) => /[A-Z]/.test(p) },
  { id: "number",  label: "Un número",                       test: (p) => /[0-9]/.test(p) },
  { id: "special", label: "Un carácter especial (!@#$%^&*)", test: (p) => /[!@#$%^&*]/.test(p) },
]

function getStrength(password) {
  const passed = rules.filter(r => r.test(password)).length
  if (passed <= 1) return { level: 0, label: "",        color: "transparent" }
  if (passed === 2) return { level: 1, label: "Débil",   color: "#ef4444" }
  if (passed === 3) return { level: 2, label: "Regular", color: "#f59e0b" }
  if (passed === 4) return { level: 3, label: "Buena",   color: "#3b82f6" }
  return              { level: 4, label: "Fuerte",  color: "#22c55e" }
}

export default function ChangePasswordModal({ userEmail, onSuccess }) {
  const [email, setEmail]       = useState("")
  const [password, setPassword] = useState("")
  const [confirm, setConfirm]   = useState("")
  const [showPwd, setShowPwd]   = useState(false)
  const [showConf, setShowConf] = useState(false)
  const [error, setError]       = useState("")
  const [loading, setLoading]   = useState(false)

  const strength    = getStrength(password)
  const allRulesMet = rules.every(r => r.test(password))
  const btnEnabled  = allRulesMet && email && password === confirm && confirm

  const handleSubmit = async () => {
    setError("")

    if (email.toLowerCase() !== userEmail.toLowerCase()) {
      setError("El correo electrónico no coincide con el registrado.")
      return
    }
    if (!allRulesMet) {
      setError("La contraseña no cumple todos los requisitos.")
      return
    }
    if (password !== confirm) {
      setError("Las contraseñas no coinciden.")
      return
    }

    try {
      setLoading(true)
      await authService.changePassword(email, password)
      onSuccess()
    } catch (err) {
      setError(err.message || "No se pudo actualizar la contraseña. Intenta de nuevo.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <style>{`
        @keyframes modalIn {
          from { opacity: 0; transform: scale(0.94) translateY(12px); }
          to   { opacity: 1; transform: scale(1)    translateY(0);    }
        }
        .cpw-input {
          width: 100%; box-sizing: border-box;
          padding: 11px 14px; border-radius: 10px;
          border: 1.5px solid rgba(255,255,255,0.1);
          background: rgba(255,255,255,0.04);
          color: white; font-size: 14px;
          font-family: 'DM Sans', sans-serif;
          outline: none; transition: border-color 0.2s;
        }
        .cpw-input:focus { border-color: rgba(99,102,241,0.7); }
        .cpw-input::placeholder { color: rgba(255,255,255,0.25); }
        .cpw-rule { display: flex; align-items: center; gap: 8px; font-size: 13px; }
      `}</style>

      <div style={{
        position: "fixed", inset: 0, zIndex: 9000,
        backdropFilter: "blur(14px) saturate(0.6)",
        WebkitBackdropFilter: "blur(14px) saturate(0.6)",
        background: "rgba(0,0,0,0.65)",
        display: "flex", alignItems: "center", justifyContent: "center",
        padding: "20px",
      }}>
        <div style={{
          background: "linear-gradient(180deg, #151d2e 0%, #0f1623 100%)",
          border: "1px solid rgba(255,255,255,0.1)",
          borderRadius: "20px", width: "100%", maxWidth: "460px",
          maxHeight: "92vh", overflowY: "auto",
          boxShadow: "0 32px 80px rgba(0,0,0,0.6)",
          fontFamily: "'DM Sans', sans-serif",
          animation: "modalIn 0.4s cubic-bezier(0.16,1,0.3,1) forwards",
        }}>

          {/* Header */}
          <div style={{ padding: "28px 28px 0" }}>
            <div style={{ display: "flex", alignItems: "flex-start", gap: "14px", marginBottom: "6px" }}>
              <div style={{
                width: "44px", height: "44px", borderRadius: "12px", flexShrink: 0,
                background: "rgba(251,146,60,0.12)", border: "1px solid rgba(251,146,60,0.25)",
                display: "flex", alignItems: "center", justifyContent: "center", color: "#fb923c",
              }}>
                <FiLock size={20} />
              </div>
              <div>
                <h2 style={{ color: "white", fontSize: "20px", fontWeight: "700", margin: "0 0 4px" }}>
                  Cambio de Contraseña Obligatorio
                </h2>
                <p style={{ color: "rgba(255,255,255,0.4)", fontSize: "13px", margin: 0, lineHeight: 1.5 }}>
                  Por seguridad, debes cambiar tu contraseña temporal antes de continuar.
                </p>
              </div>
            </div>
          </div>

          {/* Body */}
          <div style={{ padding: "20px 28px 28px" }}>

            <div style={{
              background: "rgba(99,102,241,0.07)", border: "1px solid rgba(99,102,241,0.2)",
              borderRadius: "10px", padding: "12px 16px", marginBottom: "22px",
              display: "flex", alignItems: "flex-start", gap: "10px",
            }}>
              <FiInfo size={16} color="#818cf8" style={{ flexShrink: 0, marginTop: "1px" }} />
              <p style={{ color: "rgba(255,255,255,0.55)", fontSize: "13px", margin: 0, lineHeight: 1.5 }}>
                Tu cuenta fue creada con una contraseña temporal.<br />
                Por favor, establece una contraseña nueva y segura.
              </p>
            </div>

            {error && (
              <div style={{
                background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.3)",
                borderRadius: "8px", padding: "10px 14px", marginBottom: "16px",
                color: "#f87171", fontSize: "13px",
                display: "flex", alignItems: "center", gap: "8px",
              }}>
                <FiAlertCircle size={14} /> {error}
              </div>
            )}

            {/* Correo */}
            <div style={{ marginBottom: "18px" }}>
              <label style={{ display: "block", color: "white", fontSize: "14px", fontWeight: "600", marginBottom: "8px" }}>
                Correo Electrónico
              </label>
              <input
                className="cpw-input"
                type="email"
                placeholder={userEmail || "tucorreo@empresa.com"}
                value={email}
                onChange={e => { setEmail(e.target.value); setError("") }}
                autoFocus
              />
            </div>

            {/* Nueva contraseña */}
            <div style={{ marginBottom: "10px" }}>
              <label style={{ display: "block", color: "white", fontSize: "14px", fontWeight: "600", marginBottom: "8px" }}>
                Nueva Contraseña
              </label>
              <div style={{ position: "relative" }}>
                <input
                  className="cpw-input"
                  type={showPwd ? "text" : "password"}
                  placeholder="••••••••••"
                  value={password}
                  onChange={e => { setPassword(e.target.value); setError("") }}
                  style={{ paddingRight: "44px" }}
                />
                <button onClick={() => setShowPwd(s => !s)} style={{
                  position: "absolute", right: "12px", top: "50%", transform: "translateY(-50%)",
                  background: "transparent", border: "none", cursor: "pointer",
                  color: "rgba(255,255,255,0.35)", display: "flex", alignItems: "center",
                }}>
                  {showPwd ? <FiEyeOff size={16} /> : <FiEye size={16} />}
                </button>
              </div>
            </div>

            {/* Fortaleza */}
            {password.length > 0 && (
              <div style={{ marginBottom: "14px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "6px" }}>
                  <span style={{ color: "rgba(255,255,255,0.35)", fontSize: "12px" }}>Fortaleza de la contraseña</span>
                  {strength.label && (
                    <span style={{ color: strength.color, fontSize: "12px", fontWeight: "700", display: "flex", alignItems: "center", gap: "4px" }}>
                      {strength.label}
                      {strength.level === 4 && <FiCheckCircle size={13} />}
                    </span>
                  )}
                </div>
                <div style={{ display: "flex", gap: "4px", marginBottom: "12px" }}>
                  {[1, 2, 3, 4].map(i => (
                    <div key={i} style={{
                      flex: 1, height: "5px", borderRadius: "3px",
                      background: strength.level >= i ? strength.color : "rgba(255,255,255,0.08)",
                      transition: "background 0.3s ease",
                    }} />
                  ))}
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                  {rules.map(r => {
                    const met = r.test(password)
                    return (
                      <div key={r.id} className="cpw-rule" style={{ color: met ? "#4ade80" : "rgba(255,255,255,0.3)" }}>
                        {met
                          ? <FiCheck size={14} color="#4ade80" />
                          : <div style={{ width: "14px", height: "14px", borderRadius: "50%", border: "1.5px solid rgba(255,255,255,0.2)", flexShrink: 0 }} />
                        }
                        {r.label}
                      </div>
                    )
                  })}
                </div>
              </div>
            )}

            {/* Confirmar */}
            <div style={{ marginBottom: "22px" }}>
              <label style={{ display: "block", color: "white", fontSize: "14px", fontWeight: "600", marginBottom: "8px" }}>
                Confirmar Contraseña
              </label>
              <div style={{ position: "relative" }}>
                <input
                  className="cpw-input"
                  type={showConf ? "text" : "password"}
                  placeholder="Confirma tu nueva contraseña"
                  value={confirm}
                  onChange={e => { setConfirm(e.target.value); setError("") }}
                  onKeyDown={e => e.key === "Enter" && handleSubmit()}
                  style={{
                    paddingRight: "44px",
                    borderColor: confirm && confirm !== password ? "rgba(239,68,68,0.6)"
                      : confirm && confirm === password ? "rgba(34,197,94,0.5)"
                      : "rgba(255,255,255,0.1)",
                  }}
                />
                <button onClick={() => setShowConf(s => !s)} style={{
                  position: "absolute", right: "12px", top: "50%", transform: "translateY(-50%)",
                  background: "transparent", border: "none", cursor: "pointer",
                  color: "rgba(255,255,255,0.35)", display: "flex", alignItems: "center",
                }}>
                  {showConf ? <FiEyeOff size={16} /> : <FiEye size={16} />}
                </button>
              </div>
              {confirm && password && confirm !== password && (
                <div style={{ color: "#f87171", fontSize: "12px", marginTop: "6px", display: "flex", alignItems: "center", gap: "4px" }}>
                  <FiAlertCircle size={12} /> Las contraseñas no coinciden
                </div>
              )}
              {confirm && password && confirm === password && (
                <div style={{ color: "#4ade80", fontSize: "12px", marginTop: "6px", display: "flex", alignItems: "center", gap: "4px" }}>
                  <FiCheck size={12} /> Las contraseñas coinciden
                </div>
              )}
            </div>

            {/* Submit */}
            <button
              onClick={handleSubmit}
              disabled={loading || !btnEnabled}
              style={{
                width: "100%", padding: "14px", borderRadius: "12px", border: "none",
                background: btnEnabled ? "linear-gradient(135deg, #6366f1, #4f46e5)" : "rgba(255,255,255,0.07)",
                color: btnEnabled ? "white" : "rgba(255,255,255,0.25)",
                fontSize: "15px", fontWeight: "700", fontFamily: "'DM Sans', sans-serif",
                cursor: loading || !btnEnabled ? "not-allowed" : "pointer",
                transition: "all 0.2s",
                boxShadow: btnEnabled ? "0 8px 24px rgba(99,102,241,0.35)" : "none",
              }}
            >
              {loading ? "Guardando..." : "Cambiar Contraseña"}
            </button>

            <div style={{
              marginTop: "20px", padding: "14px",
              background: "rgba(255,255,255,0.03)",
              borderRadius: "10px", border: "1px solid rgba(255,255,255,0.05)",
            }}>
              <p style={{ color: "rgba(255,255,255,0.35)", fontSize: "11px", fontWeight: "600", margin: "0 0 8px", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                Requisitos de contraseña:
              </p>
              {rules.map(r => (
                <p key={r.id} style={{ color: "rgba(255,255,255,0.25)", fontSize: "12px", margin: "4px 0", paddingLeft: "8px" }}>
                  • {r.label}
                </p>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
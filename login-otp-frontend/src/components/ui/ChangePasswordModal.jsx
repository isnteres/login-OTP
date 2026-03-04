import { useState } from "react"
import { FiLock, FiEye, FiEyeOff, FiInfo, FiCheck, FiCheckCircle, FiAlertCircle } from "react-icons/fi"
import { authService } from "../../services/authService"
import styles from "./ChangePasswordModal.module.css"

const RULES = [
  { id: "length",  label: "Al menos 8 caracteres",            test: p => p.length >= 8 },
  { id: "lower",   label: "Una letra minúscula",              test: p => /[a-z]/.test(p) },
  { id: "upper",   label: "Una letra mayúscula",              test: p => /[A-Z]/.test(p) },
  { id: "number",  label: "Un número",                       test: p => /[0-9]/.test(p) },
  { id: "special", label: "Un carácter especial (!@#$%^&*)", test: p => /[!@#$%^&*]/.test(p) },
]

function getStrength(password) {
  const n = RULES.filter(r => r.test(password)).length
  if (n <= 1) return { level: 0, label: "",        color: "transparent" }
  if (n === 2) return { level: 1, label: "Débil",   color: "#ef4444" }
  if (n === 3) return { level: 2, label: "Regular", color: "#f59e0b" }
  if (n === 4) return { level: 3, label: "Buena",   color: "#3b82f6" }
  return               { level: 4, label: "Fuerte",  color: "#22c55e" }
}

export default function ChangePasswordModal({ userEmail, onSuccess }) {
  const [email,    setEmail]    = useState("")
  const [password, setPassword] = useState("")
  const [confirm,  setConfirm]  = useState("")
  const [showPwd,  setShowPwd]  = useState(false)
  const [showConf, setShowConf] = useState(false)
  const [error,    setError]    = useState("")
  const [loading,  setLoading]  = useState(false)

  const strength    = getStrength(password)
  const allRulesMet = RULES.every(r => r.test(password))
  const btnEnabled  = allRulesMet && email && password === confirm && confirm

  const clear = fn => e => { fn(e.target.value); setError("") }

  const handleSubmit = async () => {
    setError("")
    if (email.toLowerCase() !== userEmail.toLowerCase())
      return setError("El correo electrónico no coincide con el registrado.")
    if (!allRulesMet)
      return setError("La contraseña no cumple todos los requisitos.")
    if (password !== confirm)
      return setError("Las contraseñas no coinciden.")
    try {
      setLoading(true)
      await authService.changePassword(email, password)
      onSuccess()
    } catch (err) {
      setError(err.message || "No se pudo actualizar la contraseña.")
    } finally {
      setLoading(false)
    }
  }

  const confirmBorderClass =
    confirm && confirm !== password ? styles.inputError :
    confirm && confirm === password ? styles.inputSuccess : ""

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>

        {/* Header */}
        <div className={styles.header}>
          <div className={styles.headerRow}>
            <div className={styles.iconBox}><FiLock size={20} /></div>
            <div>
              <h2 className={styles.title}>Cambio de Contraseña Obligatorio</h2>
              <p className={styles.subtitle}>Por seguridad, debés cambiar tu contraseña temporal antes de continuar.</p>
            </div>
          </div>
        </div>

        {/* Body */}
        <div className={styles.body}>

          <div className={styles.infoBanner}>
            <FiInfo size={16} color="#818cf8" style={{ flexShrink:0, marginTop:1 }} />
            <p className={styles.infoBannerText}>
              Tu cuenta fue creada con una contraseña temporal.<br />
              Por favor, establecé una contraseña nueva y segura.
            </p>
          </div>

          {error && (
            <div className={styles.errorBox}>
              <FiAlertCircle size={14} /> {error}
            </div>
          )}

          {/* Email */}
          <div className={styles.field}>
            <label className={styles.label}>Correo Electrónico</label>
            <input
              className={styles.input} type="email"
              placeholder={userEmail || "tucorreo@empresa.com"}
              value={email} onChange={clear(setEmail)} autoFocus
            />
          </div>

          {/* Nueva contraseña */}
          <div className={styles.field}>
            <label className={styles.label}>Nueva Contraseña</label>
            <div className={styles.inputWrap}>
              <input
                className={`${styles.input} ${styles.inputPadded}`}
                type={showPwd ? "text" : "password"} placeholder="••••••••••"
                value={password} onChange={clear(setPassword)}
              />
              <button className={styles.eyeBtn} onClick={() => setShowPwd(s => !s)}>
                {showPwd ? <FiEyeOff size={16} /> : <FiEye size={16} />}
              </button>
            </div>
          </div>

          {/* Fortaleza */}
          {password.length > 0 && (
            <div className={styles.strengthWrap}>
              <div className={styles.strengthRow}>
                <span className={styles.strengthLbl}>Fortaleza de la contraseña</span>
                {strength.label && (
                  <span className={styles.strengthVal} style={{ color: strength.color }}>
                    {strength.label}
                    {strength.level === 4 && <FiCheckCircle size={13} />}
                  </span>
                )}
              </div>
              <div className={styles.strengthBars}>
                {[1,2,3,4].map(i => (
                  <div key={i} className={styles.strengthBar}
                    style={{ background: strength.level >= i ? strength.color : "rgba(255,255,255,0.08)" }}
                  />
                ))}
              </div>
              <div className={styles.rulesList}>
                {RULES.map(r => {
                  const met = r.test(password)
                  return (
                    <div key={r.id} className={styles.rule} style={{ color: met ? "#4ade80" : "rgba(255,255,255,0.3)" }}>
                      {met ? <FiCheck size={14} color="#4ade80" /> : <div className={styles.ruleDot} />}
                      {r.label}
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          {/* Confirmar */}
          <div className={styles.fieldLast}>
            <label className={styles.label}>Confirmar Contraseña</label>
            <div className={styles.inputWrap}>
              <input
                className={`${styles.input} ${styles.inputPadded} ${confirmBorderClass}`}
                type={showConf ? "text" : "password"}
                placeholder="Confirmá tu nueva contraseña"
                value={confirm} onChange={clear(setConfirm)}
                onKeyDown={e => e.key === "Enter" && handleSubmit()}
              />
              <button className={styles.eyeBtn} onClick={() => setShowConf(s => !s)}>
                {showConf ? <FiEyeOff size={16} /> : <FiEye size={16} />}
              </button>
            </div>
            {confirm && password && confirm !== password && (
              <div className={`${styles.matchMsg} ${styles.matchErr}`}>
                <FiAlertCircle size={12} /> Las contraseñas no coinciden
              </div>
            )}
            {confirm && password && confirm === password && (
              <div className={`${styles.matchMsg} ${styles.matchOk}`}>
                <FiCheck size={12} /> Las contraseñas coinciden
              </div>
            )}
          </div>

          {/* Submit */}
          <button
            onClick={handleSubmit} disabled={loading || !btnEnabled}
            className={`${styles.submitBtn} ${btnEnabled ? styles.submitEnabled : styles.submitDisabled}`}
          >
            {loading ? "Guardando..." : "Cambiar Contraseña"}
          </button>

          {/* Requisitos */}
          <div className={styles.reqBox}>
            <p className={styles.reqTitle}>Requisitos de contraseña:</p>
            {RULES.map(r => <p key={r.id} className={styles.reqItem}>• {r.label}</p>)}
          </div>

        </div>
      </div>
    </div>
  )
}
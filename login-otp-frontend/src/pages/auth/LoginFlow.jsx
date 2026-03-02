/**
 * LoginFlow.jsx
 * Ubicación: src/pages/auth/LoginFlow.jsx
 *
 * Lógica:
 *  1. Email + contraseña → POST /api/login/credentials
 *     a. isTemporary = true  → dashboard con mustChangePassword
 *     b. isTemporary = false → paso OTP (el backend ya envió el código al correo)
 *  2. OTP → POST /api/login/verify-otp → dashboard
 */

import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { FiMail, FiLock, FiArrowLeft, FiEye, FiEyeOff } from "react-icons/fi"
import { authService } from "../../services/authService"
import OtpInput from "../../components/OtpInput"

export default function LoginFlow() {
  const navigate = useNavigate()

  const [step, setStep]           = useState("credentials")
  const [email, setEmail]         = useState("")
  const [password, setPassword]   = useState("")
  const [otp, setOtp]             = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError]         = useState("")
  const [showPassword, setShowPassword] = useState(false)

  // ── Step 1: credenciales ────────────────────────────────────────────────────
  const handleCredentials = async () => {
    setError("")
    if (!email || !email.includes("@")) { setError("Por favor ingresa un correo válido"); return }
    if (!password)                       { setError("Por favor ingresa tu contraseña");   return }

    try {
      setIsLoading(true)
      const res = await authService.loginCredentials(email, password)
      if (res.isTemporary) {
        navigate("/dashboard", { state: { mustChangePassword: true, userEmail: email } })
      } else {
        setStep("otp")
      }
    } catch (err) {
      setError(err.message || "Correo o contraseña incorrectos")
    } finally {
      setIsLoading(false)
    }
  }

  // ── Step 2: OTP ─────────────────────────────────────────────────────────────
  const handleOtp = async () => {
    setError("")
    if (otp.length !== 6) { setError("Ingresa el código completo de 6 dígitos"); return }

    try {
      setIsLoading(true)
      await authService.loginVerifyOtp(email, otp)
      navigate("/dashboard")
    } catch (err) {
      setError(err.message || "Código incorrecto. Intenta de nuevo.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="auth-container">
      <div className="bg-gradient" />
      <div className="bg-orbs">
        <div className="orb orb-1" />
        <div className="orb orb-2" />
        <div className="orb orb-3" />
      </div>

      <div className="auth-card">
        {error && (
          <div style={{
            background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.3)",
            padding: "12px 16px", borderRadius: "8px", margin: "0 0 16px",
            color: "#f87171", fontSize: "14px", textAlign: "center",
          }}>
            {error}
          </div>
        )}

        <div className="content-area">

          {/* ══ STEP 1: Credenciales ══ */}
          {step === "credentials" && (
            <div className="step-content fade-in">
              <div className="icon-wrapper">
                <FiMail size={40} />
              </div>
              <h2 className="step-title">Iniciar sesión</h2>
              <p className="step-description">Ingresa tus credenciales</p>

              <div className="input-group">
                <label>Correo electrónico</label>
                <input
                  type="email"
                  placeholder="tu@email.com"
                  className="input-field"
                  value={email}
                  onChange={e => { setEmail(e.target.value); setError("") }}
                  disabled={isLoading}
                  autoFocus
                />
              </div>

              <div className="input-group">
  <label>Contraseña</label>

  <div style={{ position: "relative" }}>
    <input
      type={showPassword ? "text" : "password"}
      placeholder="••••••••"
      className="input-field"
      value={password}
      onChange={e => { setPassword(e.target.value); setError("") }}
      onKeyDown={e => e.key === "Enter" && handleCredentials()}
      disabled={isLoading}
      style={{ paddingRight: "40px" }}
    />

    <button
      type="button"
      onClick={() => setShowPassword(s => !s)}
      style={{
        position: "absolute",
        right: "12px",
        top: "50%",
        transform: "translateY(-50%)",
        background: "transparent",
        border: "none",
        cursor: "pointer",
        color: "rgba(255,255,255,0.5)",
        display: "flex",
        alignItems: "center",
      }}
    >
      {showPassword ? <FiEyeOff size={16} /> : <FiEye size={16} />}
    </button>
  </div>
</div>

              <button
                onClick={handleCredentials}
                className="btn-primary"
                disabled={isLoading || !email || !password}
                style={{ opacity: isLoading || !email || !password ? 0.6 : 1 }}
              >
                <span>{isLoading ? "Verificando..." : "Ingresar"}</span>
              </button>

              <button className="btn-link" onClick={() => navigate("/")} style={{ marginTop: "12px" }}>
                <FiArrowLeft size={14} style={{ marginRight: "4px" }} /> Volver
              </button>
            </div>
          )}

          {/* ══ STEP 2: OTP ══ */}
          {step === "otp" && (
            <div className="step-content fade-in">
              <div className="icon-wrapper">
                <FiLock size={40} />
              </div>
              <h2 className="step-title">Verificación</h2>
              <p className="step-description">
                Enviamos un código a <strong>{email}</strong>
              </p>

              <div className="otp-container" style={{ marginBottom: "24px" }}>
                <OtpInput value={otp} onChange={setOtp} disabled={isLoading} />
              </div>

              <button
                onClick={handleOtp}
                className="btn-primary"
                disabled={isLoading || otp.length !== 6}
                style={{ opacity: isLoading || otp.length !== 6 ? 0.6 : 1 }}
              >
                <span>{isLoading ? "Verificando..." : "Confirmar código"}</span>
              </button>

              <button
                className="btn-link"
                onClick={() => { setStep("credentials"); setOtp(""); setError("") }}
              >
                <FiArrowLeft size={14} style={{ marginRight: "4px" }} /> Volver
              </button>
            </div>
          )}

        </div>

        <div className="card-footer">
          <p>¿Necesitas ayuda? <a href="#">Contacta soporte</a></p>
        </div>
      </div>
    </div>
  )
}
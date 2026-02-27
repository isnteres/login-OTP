import { useEffect, useState } from "react"
import {
  FiCheckCircle, FiXCircle, FiAlertTriangle, FiInfo, FiX,
} from "react-icons/fi"

const STYLES = {
  success: { bg: "#052e16", border: "#16a34a", color: "#4ade80", accent: "#22c55e" },
  error:   { bg: "#2d0a0a", border: "#dc2626", color: "#f87171", accent: "#ef4444" },
  warning: { bg: "#2d1a00", border: "#d97706", color: "#fbbf24", accent: "#f59e0b" },
  info:    { bg: "#0c1a3d", border: "#3b82f6", color: "#93c5fd", accent: "#6366f1" },
}

const TYPE_ICON = {
  success: FiCheckCircle,
  error:   FiXCircle,
  warning: FiAlertTriangle,
  info:    FiInfo,
}

// Componente Toast individual
export function Toast({ id, message, type = "success", duration = 6000, onClose }) {
  const [leaving, setLeaving] = useState(false)
  const s = STYLES[type] || STYLES.info
  const Icon = TYPE_ICON[type] || FiInfo

  useEffect(() => {
    const timer = setTimeout(() => handleClose(), duration)
    return () => clearTimeout(timer)
  }, [])

  const handleClose = () => {
    setLeaving(true)
    setTimeout(() => onClose(id), 320)
  }

  return (
    <>
      <style>{`
        @keyframes toastSlideIn {
          from { transform: translateX(110%); opacity: 0; }
          to   { transform: translateX(0);    opacity: 1; }
        }
        @keyframes toastSlideOut {
          from { transform: translateX(0);    opacity: 1; }
          to   { transform: translateX(110%); opacity: 0; }
        }
        @keyframes toastProgress {
          from { width: 100%; }
          to   { width: 0%; }
        }
      `}</style>
      <div style={{
        background: s.bg,
        border: `1px solid ${s.border}40`,
        borderLeft: `3px solid ${s.accent}`,
        borderRadius: "12px",
        padding: "14px 16px",
        minWidth: "320px", maxWidth: "420px",
        boxShadow: `0 8px 32px rgba(0,0,0,0.4), 0 0 0 1px ${s.border}20`,
        backdropFilter: "blur(16px)",
        position: "relative", overflow: "hidden",
        animation: leaving
          ? "toastSlideOut 0.32s cubic-bezier(0.4,0,1,1) forwards"
          : "toastSlideIn 0.36s cubic-bezier(0.16,1,0.3,1) forwards",
        fontFamily: "'DM Sans', sans-serif",
      }}>
        {/* Barra de progreso */}
        <div style={{
          position: "absolute", bottom: 0, left: 0,
          height: "2px", background: s.accent,
          animation: `toastProgress ${duration}ms linear forwards`,
          opacity: 0.6,
        }} />

        <div style={{ display: "flex", alignItems: "flex-start", gap: "12px" }}>
          <span style={{ color: s.color, flexShrink: 0, marginTop: "1px", display: "flex" }}>
            <Icon size={18} />
          </span>

          <div style={{ flex: 1, minWidth: 0 }}>
            <p style={{
              color: s.color, fontSize: "13px", fontWeight: "600",
              margin: "0 0 2px", lineHeight: 1.4,
            }}>
              {typeof message === "string" ? message : message.title}
            </p>
            {message?.body && (
              <p style={{
                color: `${s.color}99`, fontSize: "12px",
                margin: 0, lineHeight: 1.5, wordBreak: "break-all",
              }}>
                {message.body}
              </p>
            )}
          </div>

          <button
            onClick={handleClose}
            style={{
              background: "transparent", border: "none", cursor: "pointer",
              color: `${s.color}70`, padding: "2px", flexShrink: 0,
              display: "flex", alignItems: "center", transition: "color 0.15s",
            }}
            onMouseEnter={e => e.currentTarget.style.color = s.color}
            onMouseLeave={e => e.currentTarget.style.color = `${s.color}70`}
          >
            <FiX size={15} />
          </button>
        </div>
      </div>
    </>
  )
}

// Contenedor de toasts
export function ToastContainer({ toasts, removeToast }) {
  return (
    <div style={{
      position: "fixed", top: "20px", right: "20px",
      zIndex: 99999,
      display: "flex", flexDirection: "column", gap: "10px",
      pointerEvents: "none",
    }}>
      {toasts.map(t => (
        <div key={t.id} style={{ pointerEvents: "auto" }}>
          <Toast {...t} onClose={removeToast} />
        </div>
      ))}
    </div>
  )
}

// Hook useToast
export function useToast() {
  const [toasts, setToasts] = useState([])

  const addToast = ({ message, type = "success", duration = 6000 }) => {
    const id = Date.now() + Math.random()
    setToasts(prev => [...prev, { id, message, type, duration }])
  }

  const removeToast = (id) => {
    setToasts(prev => prev.filter(t => t.id !== id))
  }

  return { toasts, addToast, removeToast }
}
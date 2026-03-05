import { FiRefreshCw, FiUser, FiList, FiCheckCircle, FiXCircle, FiAlertTriangle, FiUserPlus } from "react-icons/fi"
import { useAuditoriaSistema } from "./hooks/useAuditoriaSistema"
import styles from "./AuditoriaSistemaPage.module.css"

const ACTION_LABELS = {
  registro_otp_enviado:    "OTP registro enviado",
  registro_otp_verificado: "OTP registro verificado",
  registro_otp_fallido:    "OTP registro fallido",
  registro_completado:     "Registro completado",
  registro_intento:        "Intento de registro",
  login_otp_enviado:       "OTP login enviado",
  login_otp_fallido:       "OTP login fallido",
  login_exitoso:           "Login exitoso",
  login_fallido:           "Login fallido",
}

const STATUS_COLOR = { success: "#22c55e", failed: "#ef4444" }
const STATUS_LABEL = { success: "Exitoso",  failed: "Fallido"  }

const SUMMARY_CARDS = [
  { key: "total_usuarios",        label: "Usuarios",        Icon: FiUser,         color: "#6366f1" },
  { key: "total_eventos",         label: "Eventos",         Icon: FiList,         color: "#8b5cf6" },
  { key: "logins_exitosos",       label: "Logins OK",       Icon: FiCheckCircle,  color: "#22c55e" },
  { key: "logins_fallidos",       label: "Logins fallidos", Icon: FiXCircle,      color: "#ef4444" },
  { key: "otps_fallidos",         label: "OTPs fallidos",   Icon: FiAlertTriangle,color: "#f59e0b" },
  { key: "registros_completados", label: "Registros",       Icon: FiUserPlus,     color: "#10b981" },
]

const COLUMNS = ["Fecha", "Email", "Acción", "Estado", "IP"]

export default function AuditoriaSistemaPage() {
  const { logs, summary, loading, refetch } = useAuditoriaSistema()

  return (
    <div className={styles.page}>

      {/* Header */}
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>🛡️ Panel de Auditoría</h1>
          <p className={styles.subtitle}>Monitoreo de seguridad del sistema</p>
        </div>
        <button onClick={refetch} className={styles.btnRefresh}>
          <FiRefreshCw size={13} /> Actualizar
        </button>
      </div>

      {loading ? (
        <div className={styles.loadingScreen}>⏳ Cargando...</div>
      ) : (
        <>
          {/* Summary cards */}
          {summary && (
            <div className={styles.summaryGrid}>
              {SUMMARY_CARDS.map(({ key, label, Icon, color }) => (
                <div key={key} className={styles.summaryCard} style={{ borderColor: color + "28" }}>
                  <span className={styles.summaryCardIcon} style={{ color }}>
                    <Icon size={18} />
                  </span>
                  <div style={{ color, fontSize: "22px", fontWeight: "700", lineHeight: 1 }}>
                    {summary[key] ?? 0}
                  </div>
                  <div className={styles.summaryCardLabel}>{label}</div>
                </div>
              ))}
            </div>
          )}

          {/* Logs table */}
          <div className={styles.tableBox}>
            <div className={styles.tableHeader}>
              <h2 className={styles.tableTitle}>
                <FiList size={14} /> Registro de eventos
              </h2>
              <span className={styles.tableCount}>{logs.length} eventos</span>
            </div>

            <div className={styles.tableScroll}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    {COLUMNS.map(col => (
                      <th key={col} className={styles.th}>{col}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {logs.length === 0 ? (
                    <tr>
                      <td colSpan="5" className={styles.emptyCell}>No hay eventos</td>
                    </tr>
                  ) : (
                    logs.map((log, i) => {
                      const color = STATUS_COLOR[log.status] || "#f59e0b"
                      const label = STATUS_LABEL[log.status] || "Pendiente"
                      return (
                        <tr key={log.id} className={styles.row} data-odd={i % 2 !== 0}>
                          <td className={`${styles.td} ${styles.muted}`} style={{ whiteSpace: "nowrap" }}>
                            {new Date(log.created_at).toLocaleString("es-ES")}
                          </td>
                          <td className={`${styles.td} ${styles.dimmed}`}>{log.email || "—"}</td>
                          <td className={styles.td}>{ACTION_LABELS[log.action] || log.action}</td>
                          <td className={styles.td}>
                            <span
                              className={styles.statusBadge}
                              style={{
                                background: color + "20",
                                color,
                                border: `1px solid ${color}35`,
                              }}
                            >
                              {label}
                            </span>
                          </td>
                          <td className={`${styles.td} ${styles.ip}`}>{log.ip_address || "—"}</td>
                        </tr>
                      )
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  )
}

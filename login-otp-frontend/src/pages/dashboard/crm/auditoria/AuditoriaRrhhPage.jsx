import { FiSearch, FiDownload, FiAlertTriangle, FiUser, FiUsers } from "react-icons/fi"
import RrhhTabs from "../../../../components/ui/RrhhTabs"
import { useAuditoriaRrhh } from "./hooks/useAuditoriaRrhh"
import styles from "./AuditoriaRrhhPage.module.css"

const STAT_CARDS = [
  { key: "totalIntentos",      label: "Total de Intentos",    sub: "Intentos de alta duplicada",              Icon: FiAlertTriangle, color: "#f59e0b" },
  { key: "empleadosAfectados", label: "Empleados Afectados",  sub: "Empleados con intentos de duplicado",     Icon: FiUser,          color: "#6366f1" },
  { key: "adminsInvolucrados", label: "Admins Involucrados",  sub: "Administradores que generaron intentos",  Icon: FiUsers,         color: "#10b981" },
]

const COLUMNS = ["Fecha y Hora", "Empleado Duplicado", "Correo del Empleado", "Admin Responsable"]

export default function AuditoriaRrhhPage({ setActive }) {
  const { duplicates = [], stats = {}, loading, search, setSearch } = useAuditoriaRrhh()

  return (
    <div className={styles.page}>
      <RrhhTabs mainTab="rrhh" subTab="auditoria" setActive={setActive} />

      {/* Header */}
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>
            <span className={styles.titleIcon}><FiAlertTriangle size={16} /></span>
            Auditoría de Registros Duplicados
          </h1>
          <p className={styles.subtitle}>
            Registro de intentos de alta de empleados con datos ya existentes en el sistema
          </p>
        </div>
        <button className={styles.btnExport}>
          <FiDownload size={13} /> Exportar CSV
        </button>
      </div>

      {/* Stats */}
      <div className={styles.statsGrid}>
        {STAT_CARDS.map(({ key, label, sub, Icon, color }) => (
          <div key={key} className={styles.statCard}>
            <div className={styles.statTop}>
              <span className={styles.statIcon}><Icon size={16} /></span>
              <p className={styles.statLabel}>{label}</p>
            </div>
            <p className={styles.statValue}>{stats[key] ?? 0}</p>
            <p className={styles.statSub}>{sub}</p>
          </div>
        ))}
      </div>

      {/* Tabla */}
      <div className={styles.tableBox}>
        <div className={styles.tableHeader}>
          <h2 className={styles.tableTitle}>Registro de Intentos</h2>
          <p className={styles.tableSubtitle}>
            Historial completo de intentos de alta con datos duplicados
          </p>
          <div className={styles.searchWrapper}>
            <FiSearch className={styles.searchIcon} size={12} />
            <input
              placeholder="Buscar por nombre, correo o administrador..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className={styles.searchInput}
            />
          </div>
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
              {loading ? (
                <tr>
                  <td colSpan="4" className={styles.emptyCell}>Cargando...</td>
                </tr>
              ) : duplicates.length === 0 ? (
                <tr>
                  <td colSpan="4" className={styles.emptyCell}>
                    No hay intentos de duplicados registrados
                  </td>
                </tr>
              ) : (
                duplicates.map((d, i) => (
                  <tr key={d.id} className={styles.row} data-odd={i % 2 !== 0}>
                    <td className={`${styles.td} ${styles.muted}`}>
                      {new Date(d.fechaHora).toLocaleString("es-ES")}
                    </td>
                    <td className={styles.td}>{d.empleadoDuplicado}</td>
                    <td className={`${styles.td} ${styles.muted}`}>{d.correoEmpleado}</td>
                    <td className={styles.td}>
                      <div>{d.adminNombre}</div>
                      <div style={{ fontSize: "11px", color: "rgba(255,255,255,0.3)", marginTop: "2px" }}>
                        {d.adminCorreo}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
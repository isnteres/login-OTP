import { FiSearch, FiDownload, FiAlertTriangle, FiUser, FiUsers } from "react-icons/fi"
import RrhhTabs from "../../../../components/ui/RrhhTabs"
import { useAuditoriaRrhh } from "./hooks/useAuditoriaRrhh"
import styles from "./AuditoriaRrhhPage.module.css"

const STAT_CARDS = [
  {
    key:   "totalIntentos",
    label: "Total de Intentos",
    sub:   "Intentos de registro duplicado",
    Icon:  FiAlertTriangle,
  },
  {
    key:   "empleadosAfectados",
    label: "Empleados Afectados",
    sub:   "Empleados con intentos de duplicado",
    Icon:  FiUser,
  },
  {
    key:   "adminsInvolucrados",
    label: "Admins Involucrados",
    sub:   "Administradores que generaron intentos",
    Icon:  FiUsers,
  },
]

const COLUMNS = ["Fecha y Hora", "Empleado Duplicado", "Correo del Empleado", "Admin Responsable"]

export default function AuditoriaRrhhPage({ setActive }) {
  const { registros, stats, loading, search, setSearch } = useAuditoriaRrhh()

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
        {STAT_CARDS.map(({ key, label, sub, Icon }) => (
          <div key={key} className={styles.statCard}>
            <div className={styles.statTop}>
              <span className={styles.statIcon}><Icon size={16} /></span>
              <p className={styles.statLabel}>{label}</p>
            </div>
            <p className={styles.statValue}>{stats[key]}</p>
            <p className={styles.statSub}>{sub}</p>
          </div>
        ))}
      </div>

      {/* Tabla */}
      <div className={styles.tableBox}>
        <div className={styles.tableHeader}>
          <h2 className={styles.tableTitle}>Registro de Intentos</h2>
          <p className={styles.tableSubtitle}>
            Historial de intentos de registro con datos de empleados ya existentes
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
                  <td colSpan={COLUMNS.length} className={styles.emptyCell}>Cargando...</td>
                </tr>
              ) : registros.length === 0 ? (
                <tr>
                  <td colSpan={COLUMNS.length} className={styles.emptyCell}>
                    No hay intentos de registro duplicado
                  </td>
                </tr>
              ) : (
                registros.map((r, i) => (
                  <tr key={r.id} className={styles.row} data-odd={i % 2 !== 0}>
                    {/* Fecha y hora */}
                    <td className={`${styles.td} ${styles.muted}`} style={{ whiteSpace: "nowrap" }}>
                      {new Date(r.fechaHora).toLocaleString("es-ES")}
                    </td>

                    {/* Empleado duplicado */}
                    <td className={styles.td}>
                      <span style={{ fontWeight: 500 }}>{r.empleadoDuplicado}</span>
                    </td>

                    {/* Correo del empleado que se intentó duplicar */}
                    <td className={`${styles.td} ${styles.muted}`}>
                      {r.correoEmpleado}
                    </td>

                    {/* Admin responsable: nombre + correo */}
                    <td className={styles.td}>
                      <span style={{ fontWeight: 500 }}>{r.adminNombre}</span>
                      <br />
                      <span className={styles.faint} style={{ fontSize: "11px" }}>{r.adminCorreo}</span>
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
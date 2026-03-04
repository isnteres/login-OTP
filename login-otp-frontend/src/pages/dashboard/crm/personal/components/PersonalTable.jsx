import { FiEye, FiEdit2, FiSlash, FiTrash2, FiUnlock } from "react-icons/fi"
import styles from "./PersonalTable.module.css"

const TYPE_COLORS = {
  Instructor:                  "#6366f1",
  Desarrollador:               "#10b981",
  Administrador:               "#f59e0b",
  "Asistente Administrativo":  "#06b6d4",
}

const STATUS_STYLES = {
  Activo:    { bg: "#22c55e18", color: "#22c55e", border: "#22c55e30" },
  Inactivo:  { bg: "#ef444418", color: "#ef4444", border: "#ef444430" },
  Bloqueado: { bg: "#f59e0b18", color: "#f59e0b", border: "#f59e0b30" },
}

const COLUMNS = ["Nombre", "Email", "Tipo", "Puesto", "Departamento", "Estado", "Acciones"]

export default function PersonalTable({ employees, onView, onEdit, onToggleBlock, onDelete }) {
  if (employees.length === 0)
    return <div className={styles.empty}>No hay empleados</div>

  return (
    <div className={styles.wrapper}>
      <table className={styles.table}>
        <thead>
          <tr>{COLUMNS.map(col => <th key={col} className={styles.th}>{col}</th>)}</tr>
        </thead>
        <tbody>
          {employees.map(emp => {
            const color  = TYPE_COLORS[emp.type] || "#6366f1"
            const status = STATUS_STYLES[emp.status] || STATUS_STYLES.Inactivo
            return (
              <tr key={emp.id} className={styles.row}>

                <td className={styles.td}>
                  <div className={styles.nameCell}>
                    <div className={styles.avatar} style={{ background: color+"22", color }}>
                      {emp.name[0]}
                    </div>
                    <span className={styles.nameText}>{emp.name}</span>
                  </div>
                </td>

                <td className={`${styles.td} ${styles.muted}`}>{emp.email}</td>

                <td className={styles.td}>
                  <span className={styles.badge} style={{ background: color+"20", color, border:`1px solid ${color}35` }}>
                    {emp.type}
                  </span>
                </td>

                <td className={`${styles.td} ${styles.muted}`}>{emp.position || "N/A"}</td>
                <td className={`${styles.td} ${styles.muted}`}>{emp.department || "—"}</td>

                <td className={styles.td}>
                  <span className={styles.statusBadge} style={{ background: status.bg, color: status.color, border:`1px solid ${status.border}` }}>
                    {emp.status}
                  </span>
                </td>

                <td className={styles.td}>
                  <div className={styles.actions}>
                    <button onClick={() => onView?.(emp)} className={styles.actionBtn} style={{ color:"#818cf8" }} title="Ver detalle">
                      <FiEye size={13} />
                    </button>
                    <button onClick={() => onEdit?.(emp)} className={styles.actionBtn} style={{ color:"#34d399" }} title="Editar">
                      <FiEdit2 size={13} />
                    </button>
                    <button onClick={() => onToggleBlock?.(emp)} className={styles.actionBtn} style={{ color:"#f59e0b" }} title={emp.status === "Bloqueado" ? "Desbloquear" : "Bloquear"}>
                      {emp.status === "Bloqueado" ? <FiUnlock size={13} /> : <FiSlash size={13} />}
                    </button>
                    <button onClick={() => onDelete?.(emp)} className={styles.actionBtn} style={{ color:"#f87171" }} title="Eliminar">
                      <FiTrash2 size={13} />
                    </button>
                  </div>
                </td>

              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
import { FiEye, FiEdit2, FiSlash, FiTrash2 } from "react-icons/fi"
import styles from "./PersonalTable.module.css"

const TYPE_COLORS = {
  Instructor:                "#6366f1",
  Desarrollador:             "#10b981",
  Administrador:             "#f59e0b",
  "Asistente Administrativo": "#06b6d4",
}

const COLUMNS = ["Nombre", "Email", "Tipo", "Puesto", "Departamento", "Estado", "Acciones"]

export default function PersonalTable({ employees }) {
  if (employees.length === 0) {
    return <div className={styles.empty}>No hay empleados</div>
  }

  return (
    <div className={styles.wrapper}>
      <table className={styles.table}>
        <thead>
          <tr>
            {COLUMNS.map(col => (
              <th key={col} className={styles.th}>{col}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {employees.map(emp => {
            const color = TYPE_COLORS[emp.type] || "#6366f1"
            return (
              <tr key={emp.id} className={styles.row}>
                {/* Nombre */}
                <td className={styles.td}>
                  <div className={styles.nameCell}>
                    <div
                      className={styles.avatar}
                      style={{ background: color + "22", color }}
                    >
                      {emp.name[0]}
                    </div>
                    <span className={styles.nameText}>{emp.name}</span>
                  </div>
                </td>

                {/* Email */}
                <td className={`${styles.td} ${styles.muted}`}>{emp.email}</td>

                {/* Tipo */}
                <td className={styles.td}>
                  <span
                    className={styles.badge}
                    style={{
                      background: color + "20",
                      color,
                      border: `1px solid ${color}35`,
                    }}
                  >
                    {emp.type}
                  </span>
                </td>

                {/* Puesto */}
                <td className={`${styles.td} ${styles.muted}`}>{emp.position || "N/A"}</td>

                {/* Departamento */}
                <td className={`${styles.td} ${styles.muted}`}>{emp.department || "—"}</td>

                {/* Estado */}
                <td className={styles.td}>
                  <span
                    className={styles.statusBadge}
                    style={{
                      background: emp.status === "Activo" ? "#22c55e18" : "#ef444418",
                      color:      emp.status === "Activo" ? "#22c55e"   : "#ef4444",
                      border:     `1px solid ${emp.status === "Activo" ? "#22c55e30" : "#ef444430"}`,
                    }}
                  >
                    {emp.status === "Activo" ? "Activo" : "Inactivo"}
                  </span>
                </td>

                {/* Acciones */}
                <td className={styles.td}>
                  <div className={styles.actions}>
                    <button className={styles.actionBtn} style={{ color: "#818cf8" }} title="Ver detalle">
                      <FiEye size={13} />
                    </button>
                    <button className={styles.actionBtn} style={{ color: "#34d399" }} title="Editar">
                      <FiEdit2 size={13} />
                    </button>
                    <button className={styles.actionBtn} style={{ color: "#f59e0b" }} title="Bloquear">
                      <FiSlash size={13} />
                    </button>
                    <button className={styles.actionBtn} style={{ color: "#f87171" }} title="Eliminar">
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

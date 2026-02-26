import styles from "./PersonalGallery.module.css"

const TYPE_COLORS = {
  Instructor:                 "#6366f1",
  Desarrollador:              "#10b981",
  Administrador:              "#f59e0b",
  "Asistente Administrativo": "#06b6d4",
}

export default function PersonalGallery({ employees }) {
  if (employees.length === 0) {
    return <p className={styles.empty}>No hay empleados</p>
  }

  return (
    <div className={styles.grid}>
      {employees.map(emp => {
        const color = TYPE_COLORS[emp.type] || "#6366f1"
        return (
          <div key={emp.id} className={styles.card}>
            <div className={styles.avatarWrapper}>
              <div
                className={styles.avatar}
                style={{ background: color + "25", border: `2px solid ${color}`, color }}
              >
                {emp.name[0]}
              </div>
              {emp.status === "Activo" && (
                <div className={styles.onlineDot} />
              )}
            </div>

            <p className={styles.name}>{emp.name}</p>

            <span
              className={styles.typeBadge}
              style={{
                background: color + "20",
                color,
                border: `1px solid ${color}35`,
              }}
            >
              {emp.type.toLowerCase()}
            </span>

            <p className={styles.position}>{emp.position || "—"}</p>
            <p className={styles.department}>{emp.department || ""}</p>
          </div>
        )
      })}
    </div>
  )
}

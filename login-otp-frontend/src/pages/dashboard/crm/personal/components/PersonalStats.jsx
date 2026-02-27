import { FiUsers, FiBookOpen, FiCode, FiShield, FiUser } from "react-icons/fi"
import styles from "./PersonalStats.module.css"

const CARDS = [
  { key: "total",           label: "Total Personal",         sub: "Empleados registrados",   Icon: FiUsers    },
  { key: "instructores",    label: "Instructores",            sub: "Equipo docente",          Icon: FiBookOpen },
  { key: "desarrolladores", label: "Desarrolladores",         sub: "Equipo técnico",          Icon: FiCode     },
  { key: "administradores", label: "Administradores",         sub: "Personal administrativo", Icon: FiShield   },
  { key: "asistentes",      label: "Asist. Administrativos",  sub: "Personal de soporte",     Icon: FiUser     },
]

export default function PersonalStats({ stats }) {
  return (
    <div className={styles.grid}>
      {CARDS.map(({ key, label, sub, Icon }) => (
        <div key={key} className={styles.card}>
          <div className={styles.cardTop}>
            <p className={styles.cardLabel}>{label}</p>
            <span className={styles.cardIcon}>
              <Icon size={22} />
            </span>
          </div>
          <p className={styles.cardValue}>{stats?.[key] ?? 0}</p>
          <p className={styles.cardSub}>{sub}</p>
        </div>
      ))}
    </div>
  )
}

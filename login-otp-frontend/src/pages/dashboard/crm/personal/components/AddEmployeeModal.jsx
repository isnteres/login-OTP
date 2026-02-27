import { useState } from "react"
import { FiX, FiInfo } from "react-icons/fi"
import {
  EMPLOYEE_TYPES, DEPARTMENTS, POSITIONS_BY_TYPE,
  EDUCATION_LEVELS, EMPLOYEE_STATUSES,
} from "../../../../../constants/employee.constants"
import { employeeService } from "../../../../../services/employeeService"
import styles from "./AddEmployeeModal.module.css"

const INITIAL_FORM = {
  name: "", email: "", phone: "",
  type: "Instructor", department: "", position: "",
  status: "Activo", hireDate: "",
  specialty: "", experience: "", education: "",
}

export default function AddEmployeeModal({ isOpen, onClose, onEmployeeCreated }) {
  const [form, setForm]       = useState(INITIAL_FORM)
  const [loading, setLoading] = useState(false)
  const [error, setError]     = useState("")

  if (!isOpen) return null

  const set = (key) => (e) => setForm(f => ({ ...f, [key]: e.target.value }))

  const handleTypeChange = (e) => {
    setForm(f => ({ ...f, type: e.target.value, position: "" }))
  }

  const handleSubmit = async () => {
    if (!form.name || !form.email) return
    try {
      setLoading(true)
      setError("")
      const result = await employeeService.create(form)
      // result = { employee: {...}, tempPassword: "XXXX" }
      if (onEmployeeCreated) onEmployeeCreated(result)
      setForm(INITIAL_FORM)
      onClose()
    } catch (err) {
      setError(err.message || "Error al crear el empleado")
    } finally {
      setLoading(false)
    }
  }

  const positions = POSITIONS_BY_TYPE[form.type] || []

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>

        <div className={styles.header}>
          <h2 className={styles.title}>Agregar Nuevo Empleado</h2>
          <button onClick={onClose} className={styles.closeBtn}>
            <FiX size={16} />
          </button>
        </div>

        <div className={styles.body}>

          {error && (
            <div style={{
              background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.3)",
              borderRadius: "8px", padding: "10px 14px", marginBottom: "14px",
              color: "#f87171", fontSize: "13px",
            }}>
              {error}
            </div>
          )}

          <p className={styles.sectionTitle}>Información del Usuario</p>
          <div className={styles.grid2}>
            <div className={styles.field}>
              <label className={styles.label}>Nombre Completo *</label>
              <input placeholder="Ej: Juan Pérez García" value={form.name} onChange={set("name")} className={styles.input} />
            </div>
            <div className={styles.field}>
              <label className={styles.label}>Correo Electrónico *</label>
              <input type="email" placeholder="juan.perez@empresa.com" value={form.email} onChange={set("email")} className={styles.input} />
            </div>
          </div>
          <div className={styles.field}>
            <label className={styles.label}>Teléfono</label>
            <input placeholder="+51 999 999 999" value={form.phone} onChange={set("phone")} className={`${styles.input} ${styles.halfWidth}`} />
          </div>

          <p className={styles.sectionTitle}>Información Laboral</p>
          <div className={styles.grid2}>
            <div className={styles.field}>
              <label className={styles.label}>Tipo de Empleado *</label>
              <select value={form.type} onChange={handleTypeChange} className={styles.select}>
                {EMPLOYEE_TYPES.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
              </select>
            </div>
            <div className={styles.field}>
              <label className={styles.label}>Departamento</label>
              <select value={form.department} onChange={set("department")} className={styles.select}>
                <option value="">Seleccionar departamento</option>
                {DEPARTMENTS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
              </select>
            </div>
            <div className={styles.field}>
              <label className={styles.label}>Puesto / Posición</label>
              <select value={form.position} onChange={set("position")} className={styles.select}>
                <option value="">Seleccionar puesto</option>
                {positions.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
              </select>
            </div>
            <div className={styles.field}>
              <label className={styles.label}>Fecha de Contratación</label>
              <input type="date" value={form.hireDate} onChange={set("hireDate")} className={styles.input} />
            </div>
          </div>
          <div className={styles.field}>
            <label className={styles.label}>Estado *</label>
            <select value={form.status} onChange={set("status")} className={`${styles.select} ${styles.halfWidth}`}>
              {EMPLOYEE_STATUSES.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
          </div>

          <p className={styles.sectionTitle}>Información Profesional</p>
          <div className={styles.field}>
            <label className={styles.label}>Especialidad</label>
            <input placeholder="Ej: Desarrollo Web, RRHH..." value={form.specialty} onChange={set("specialty")} className={styles.input} />
          </div>
          <div className={styles.grid2}>
            <div className={styles.field}>
              <label className={styles.label}>Años de Experiencia</label>
              <input type="number" min="0" placeholder="0" value={form.experience} onChange={set("experience")} className={styles.input} />
            </div>
            <div className={styles.field}>
              <label className={styles.label}>Nivel de Educación</label>
              <select value={form.education} onChange={set("education")} className={styles.select}>
                <option value="">Seleccionar</option>
                {EDUCATION_LEVELS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
              </select>
            </div>
          </div>

          <div style={{
            marginTop: "8px", padding: "12px 14px",
            background: "rgba(99,102,241,0.07)", border: "1px solid rgba(99,102,241,0.2)",
            borderRadius: "10px", display: "flex", gap: "10px", alignItems: "flex-start",
          }}>
            <FiInfo size={15} color="#818cf8" style={{ flexShrink: 0, marginTop: "1px" }} />
            <p style={{ color: "rgba(255,255,255,0.45)", fontSize: "12px", margin: 0, lineHeight: 1.5 }}>
              Se generará una <strong style={{ color: "#a5b4fc" }}>contraseña temporal</strong> automáticamente
              y se enviará al correo del empleado. Al iniciar sesión, se le pedirá que la cambie.
            </p>
          </div>
        </div>

        <div className={styles.footer}>
          <button onClick={onClose} className={styles.btnCancel}>Cancelar</button>
          <button
            onClick={handleSubmit}
            disabled={!form.name || !form.email || loading}
            className={styles.btnSubmit}
          >
            {loading ? "Creando..." : "Agregar Empleado"}
          </button>
        </div>
      </div>
    </div>
  )
}
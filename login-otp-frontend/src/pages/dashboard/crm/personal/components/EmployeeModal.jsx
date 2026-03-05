import { useState, useEffect } from "react"
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

const TITLES = { add: "Agregar Nuevo Empleado", view: "Detalle del Empleado", edit: "Editar Empleado" }

// Campo genérico reutilizable
function Field({ label, children }) {
  return (
    <div className={styles.field}>
      <label className={styles.label}>{label}</label>
      {children}
    </div>
  )
}

export default function EmployeeModal({ isOpen, mode = "add", employee = null, onClose, onSuccess }) {
  const [form,    setForm]    = useState(INITIAL_FORM)
  const [loading, setLoading] = useState(false)
  const [error,   setError]   = useState("")

  const isView = mode === "view"
  const isEdit = mode === "edit"
  const isAdd  = mode === "add"

  // Cuando modo view/edit: cargar datos del empleado en el form
  useEffect(() => {
    if (employee && (isView || isEdit)) {
      setForm({
        name:       employee.name       || "",
        email:      employee.email      || "",
        phone:      employee.phone      || "",
        type:       employee.type       || "Instructor",
        department: employee.department || "",
        position:   employee.position   || "",
        status:     employee.status     || "Activo",
        hireDate:   employee.hireDate   || "",
        specialty:  employee.specialty  || "",
        experience: employee.experience ?? "",
        education:  employee.education  || "",
      })
    } else {
      setForm(INITIAL_FORM)
    }
    setError("")
  }, [employee, mode, isOpen])

  if (!isOpen) return null

  const set = key => e => setForm(f => ({ ...f, [key]: e.target.value }))
  const setType = e => setForm(f => ({ ...f, type: e.target.value, position: "" }))
  const positions = POSITIONS_BY_TYPE[form.type] || []

  const handleSubmit = async () => {
    if (!form.name || !form.email) return
    try {
      setLoading(true)
      setError("")
      if (isAdd) {
        const result = await employeeService.create(form)
        onSuccess?.({ mode: "add", ...result })
      } else if (isEdit) {
        const updated = await employeeService.update(employee.id, form)
        onSuccess?.({ mode: "edit", employee: updated })
      }
      onClose()
    } catch (err) {
      setError(err.message || "Ocurrió un error")
    } finally {
      setLoading(false)
    }
  }

  const inp  = key => ({ value: form[key], onChange: set(key), disabled: isView, className: styles.input })
  const sel  = key => ({ value: form[key], onChange: set(key), disabled: isView, className: styles.select })

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>

        {/* Header */}
        <div className={styles.header}>
          <h2 className={styles.title}>{TITLES[mode]}</h2>
          <button onClick={onClose} className={styles.closeBtn}><FiX size={16} /></button>
        </div>

        {/* Body */}
        <div className={styles.body}>

          {error && <div className={styles.errorBox}>{error}</div>}

          {/* Información del Usuario */}
          <p className={styles.sectionTitle}>Información del Usuario</p>
          <div className={styles.grid2}>
            <Field label="Nombre Completo *">
              <input placeholder="Ej: Juan Pérez García" {...inp("name")} />
            </Field>
            <Field label="Correo Electrónico *">
              <input type="email" placeholder="juan.perez@empresa.com" {...inp("email")} disabled={isView || isEdit} className={styles.input} />
            </Field>
          </div>
          <Field label="Teléfono">
            <input placeholder="+51 999 999 999" {...inp("phone")} className={`${styles.input} ${styles.halfWidth}`} />
          </Field>

          {/* Información Laboral */}
          <p className={styles.sectionTitle}>Información Laboral</p>
          <div className={styles.grid2}>
            <Field label="Tipo de Empleado *">
              <select value={form.type} onChange={setType} disabled={isView} className={styles.select}>
                {EMPLOYEE_TYPES.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
              </select>
            </Field>
            <Field label="Departamento">
              <select {...sel("department")}>
                <option value="">Seleccionar departamento</option>
                {DEPARTMENTS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
              </select>
            </Field>
            <Field label="Puesto / Posición">
              <select {...sel("position")}>
                <option value="">Seleccionar puesto</option>
                {positions.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
              </select>
            </Field>
            <Field label="Fecha de Contratación">
              <input type="date" {...inp("hireDate")} />
            </Field>
          </div>
          <Field label="Estado *">
            <select {...sel("status")} className={`${styles.select} ${styles.halfWidth}`}>
              {EMPLOYEE_STATUSES.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
          </Field>

          {/* Información Profesional */}
          <p className={styles.sectionTitle}>Información Profesional</p>
          <Field label="Especialidad">
            <input placeholder="Ej: Desarrollo Web, RRHH..." {...inp("specialty")} />
          </Field>
          <div className={styles.grid2}>
            <Field label="Años de Experiencia">
              <input type="number" min="0" placeholder="0" {...inp("experience")} />
            </Field>
            <Field label="Nivel de Educación">
              <select {...sel("education")}>
                <option value="">Seleccionar</option>
                {EDUCATION_LEVELS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
              </select>
            </Field>
          </div>

          {/* Banner contraseña temporal — solo en modo add */}
          {isAdd && (
            <div className={styles.infoBanner}>
              <FiInfo size={15} color="#818cf8" style={{ flexShrink:0, marginTop:1 }} />
              <p className={styles.infoBannerText}>
                Se generará una <strong style={{ color:"#a5b4fc" }}>contraseña temporal</strong> automáticamente
                y se enviará al correo del empleado. Al iniciar sesión, se le pedirá que la cambie.
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className={styles.footer}>
          <button onClick={onClose} className={styles.btnCancel}>
            {isView ? "Cerrar" : "Cancelar"}
          </button>
          {!isView && (
            <button
              onClick={handleSubmit}
              disabled={!form.name || !form.email || loading}
              className={styles.btnSubmit}
            >
              {loading ? "Guardando..." : isAdd ? "Agregar Empleado" : "Guardar Cambios"}
            </button>
          )}
        </div>

      </div>
    </div>
  )
}
import { useState } from "react";
import { FiX } from "react-icons/fi";
import {
  EMPLOYEE_TYPES,
  DEPARTMENTS,
  POSITIONS_BY_TYPE,
  EDUCATION_LEVELS,
  EMPLOYEE_STATUSES,
} from "../../../../../constants/employee.constants";
import styles from "./AddEmployeeModal.module.css";

const INITIAL_FORM = {
  name: "",
  email: "",
  phone: "",
  type: "Instructor",
  department: "",
  position: "",
  status: "activo",
  hireDate: "",
  specialty: "",
  experience: "",
  education: "",
};

export default function AddEmployeeModal({ isOpen, onClose, onSubmit }) {
  const [form, setForm] = useState(INITIAL_FORM);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const handleTypeChange = (e) => {
    setForm((f) => ({ ...f, type: e.target.value, position: "" }));
  };

  const handleSubmit = async () => {
    if (!form.name || !form.email) return;
    setIsLoading(true);
    setError("");
    try {
      await onSubmit(form);
      setForm(INITIAL_FORM);
      onClose();
    } catch (err) {
      setError(err.message || "Error al agregar empleado");
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setForm(INITIAL_FORM);
    setError("");
    onClose();
  };

  const positions = POSITIONS_BY_TYPE[form.type] || [];

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        {/* Header */}
        <div className={styles.header}>
          <h2 className={styles.title}>Agregar Nuevo Empleado</h2>
          <button onClick={handleClose} className={styles.closeBtn}>
            <FiX size={16} />
          </button>
        </div>

        {/* Body */}
        <div className={styles.body}>
          <p className={styles.sectionTitle}>Información del Usuario</p>
          <div className={styles.grid2}>
            <div className={styles.field}>
              <label className={styles.label}>Nombre Completo *</label>
              <input
                placeholder="Ej: Juan Pérez García"
                value={form.name}
                onChange={set("name")}
                className={styles.input}
                disabled={isLoading}
              />
            </div>
            <div className={styles.field}>
              <label className={styles.label}>Correo Electrónico *</label>
              <input
                type="email"
                placeholder="juan.perez@empresa.com"
                value={form.email}
                onChange={(e) => {
                  set("email")(e);
                  setError("");
                }}
                className={styles.input}
                disabled={isLoading}
              />
            </div>
          </div>
          <div className={styles.field}>
            <label className={styles.label}>Teléfono</label>
            <input
              placeholder="+51 999 999 999"
              value={form.phone}
              onChange={set("phone")}
              className={`${styles.input} ${styles.halfWidth}`}
              disabled={isLoading}
            />
          </div>

          <p className={styles.sectionTitle}>Información Laboral</p>
          <div className={styles.grid2}>
            <div className={styles.field}>
              <label className={styles.label}>Tipo de Empleado *</label>
              <select
                value={form.type}
                onChange={handleTypeChange}
                className={styles.select}
                disabled={isLoading}
              >
                {EMPLOYEE_TYPES.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </select>
            </div>
            <div className={styles.field}>
              <label className={styles.label}>Departamento</label>
              <select
                value={form.department}
                onChange={set("department")}
                className={styles.select}
                disabled={isLoading}
              >
                <option value="">Seleccionar departamento</option>
                {DEPARTMENTS.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </select>
            </div>
            <div className={styles.field}>
              <label className={styles.label}>Puesto / Posición</label>
              <select
                value={form.position}
                onChange={set("position")}
                className={styles.select}
                disabled={isLoading}
              >
                <option value="">Seleccionar puesto</option>
                {positions.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </select>
            </div>
            <div className={styles.field}>
              <label className={styles.label}>Fecha de Contratación</label>
              <input
                type="date"
                value={form.hireDate}
                onChange={set("hireDate")}
                className={styles.input}
                disabled={isLoading}
              />
            </div>
          </div>
          <div className={styles.field}>
            <label className={styles.label}>Estado *</label>
            <select
              value={form.status}
              onChange={set("status")}
              className={`${styles.select} ${styles.halfWidth}`}
              disabled={isLoading}
            >
              {EMPLOYEE_STATUSES.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
          </div>

          <p className={styles.sectionTitle}>Información Profesional</p>
          <div className={styles.field}>
            <label className={styles.label}>Especialidad</label>
            <input
              placeholder="Ej: Desarrollo Web, RRHH, Contabilidad..."
              value={form.specialty}
              onChange={set("specialty")}
              className={styles.input}
              disabled={isLoading}
            />
          </div>
          <div className={styles.grid2}>
            <div className={styles.field}>
              <label className={styles.label}>Años de Experiencia</label>
              <input
                type="number"
                min="0"
                placeholder="0"
                value={form.experience}
                onChange={set("experience")}
                className={styles.input}
                disabled={isLoading}
              />
            </div>
            <div className={styles.field}>
              <label className={styles.label}>Nivel de Educación</label>
              <select
                value={form.education}
                onChange={set("education")}
                className={styles.select}
                disabled={isLoading}
              >
                <option value="">Seleccionar</option>
                {EDUCATION_LEVELS.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Error */}
        {error && (
          <div
            style={{
              background: "#fee2e2",
              border: "1px solid #fca5a5",
              padding: "12px 16px",
              borderRadius: "8px",
              margin: "0 24px 12px",
              color: "#dc2626",
              fontSize: "14px",
              textAlign: "center",
            }}
          >
            {error}
          </div>
        )}

        {/* Footer */}
        <div className={styles.footer}>
          <button
            onClick={handleClose}
            className={styles.btnCancel}
            disabled={isLoading}
          >
            Cancelar
          </button>
          <button
            onClick={handleSubmit}
            disabled={!form.name || !form.email || isLoading}
            className={styles.btnSubmit}
            style={{
              opacity: !form.name || !form.email || isLoading ? 0.6 : 1,
            }}
          >
            {isLoading ? "Agregando..." : "Agregar Empleado"}
          </button>
        </div>
      </div>
    </div>
  );
}

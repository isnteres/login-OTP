import { useEffect, useState } from "react"
import { FiX, FiSave, FiBookOpen } from "react-icons/fi"
import { courseService } from "../../../../../services/courseService"
import styles from "./CourseModal.module.css"

const EMPTY_FORM = {
  title: "",
  description: "",
  category: "",
  level: "Básico",
  price: 0,
  duration: "",
  instructor: "",
  thumbnailUrl: "",
  previewUrl: "",
  topics: "",
  learnings: "",
  requirements: "",
  includesCertificate: true,
}

const MAX_URL_LENGTH = 500

export default function CourseModal({ isOpen, mode, course, onClose, onSuccess, onError }) {
  const [form, setForm] = useState(EMPTY_FORM)
  const [saving, setSaving] = useState(false)
  const readOnly = mode === "view"

  useEffect(() => {
    if (!isOpen) return
    if (course) {
      setForm({
        title:       course.title || "",
        description: course.description || "",
        category:    course.category || "",
        level:       course.level || "Básico",
        price:       course.price ?? 0,
        duration:    course.duration || "",
        instructor:  course.instructor || "",
        thumbnailUrl: course.thumbnailUrl || "",
        previewUrl:   course.previewUrl || "",
        topics:        (course.topics || []).join("\n"),
        learnings:     (course.learnings || []).join("\n"),
        requirements:  (course.requirements || []).join("\n"),
        includesCertificate: !!course.includesCertificate,
      })
    } else {
      setForm(EMPTY_FORM)
    }
  }, [isOpen, course])

  if (!isOpen) return null

  const handleChange = (field, value) => {
    setForm(prev => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (readOnly) {
      onClose?.()
      return
    }

    if (form.thumbnailUrl && form.thumbnailUrl.length > MAX_URL_LENGTH) {
      onError?.("La URL de la portada es demasiado larga. Use un enlace directo a la imagen (máx. 500 caracteres).")
      return
    }
    if (form.previewUrl && form.previewUrl.length > MAX_URL_LENGTH) {
      onError?.("La URL del video/preview es demasiado larga. Use un enlace directo (máx. 500 caracteres).")
      return
    }

    try {
      setSaving(true)

      const payload = {
        ...form,
        topics:       form.topics,
        learnings:    form.learnings,
        requirements: form.requirements,
      }

      let saved
      if (mode === "edit" && course) {
        saved = await courseService.update(course.id, payload)
      } else {
        saved = await courseService.create(payload)
      }

      onSuccess?.({ mode: mode === "edit" ? "edit" : "add", course: saved })
      onClose?.()
    } catch (err) {
      const msg = err.message || "Ocurrió un error al guardar el curso."
      const friendly = /too long|truncated|1406/i.test(msg)
        ? "La URL de la imagen o del video es demasiado larga. Use enlaces directos (máx. 500 caracteres)."
        : msg
      onError?.(friendly)
    } finally {
      setSaving(false)
    }
  }

  const title =
    mode === "view" ? "Detalle del curso" :
    mode === "edit" ? "Editar curso" :
    "Nuevo curso"

  return (
    <div className={styles.backdrop}>
      <div className={styles.modal}>
        <div className={styles.header}>
          <div className={styles.headerTitle}>
            <span className={styles.icon}><FiBookOpen size={15} /></span>
            <div>
              <h2 className={styles.title}>{title}</h2>
              {course && (
                <p className={styles.subtitle}>
                  ID #{course.id} · {course.category}
                </p>
              )}
            </div>
          </div>
          <button className={styles.closeBtn} onClick={onClose}>
            <FiX size={16} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.grid}>
            <div className={styles.column}>
              <label className={styles.field}>
                <span>Título del curso *</span>
                <input
                  required
                  type="text"
                  value={form.title}
                  onChange={e => handleChange("title", e.target.value)}
                  disabled={saving || readOnly}
                />
              </label>

              <label className={styles.field}>
                <span>Categoría *</span>
                <input
                  required
                  type="text"
                  value={form.category}
                  onChange={e => handleChange("category", e.target.value)}
                  disabled={saving || readOnly}
                />
              </label>

              <div className={styles.row}>
                <label className={styles.field}>
                  <span>Nivel</span>
                  <select
                    value={form.level}
                    onChange={e => handleChange("level", e.target.value)}
                    disabled={saving || readOnly}
                  >
                    <option value="Básico">Básico</option>
                    <option value="Intermedio">Intermedio</option>
                    <option value="Avanzado">Avanzado</option>
                  </select>
                </label>

                <label className={styles.field}>
                  <span>Precio (S/)</span>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={form.price}
                    onChange={e => handleChange("price", parseFloat(e.target.value || "0"))}
                    disabled={saving || readOnly}
                  />
                </label>
              </div>

              <div className={styles.row}>
                <label className={styles.field}>
                  <span>Duración</span>
                  <input
                    type="text"
                    value={form.duration}
                    onChange={e => handleChange("duration", e.target.value)}
                    disabled={saving || readOnly}
                    placeholder="Ej: 8 semanas"
                  />
                </label>

                <label className={styles.field}>
                  <span>Instructor</span>
                  <input
                    type="text"
                    value={form.instructor}
                    onChange={e => handleChange("instructor", e.target.value)}
                    disabled={saving || readOnly}
                    placeholder="Ej: TechSkillsPerú"
                  />
                </label>
              </div>

              <label className={styles.field}>
                <span>Descripción</span>
                <textarea
                  rows="4"
                  value={form.description}
                  onChange={e => handleChange("description", e.target.value)}
                  disabled={saving || readOnly}
                />
              </label>
            </div>

            <div className={styles.column}>
              <label className={styles.field}>
                <span>URL de portada</span>
                <input
                  type="text"
                  value={form.thumbnailUrl}
                  onChange={e => handleChange("thumbnailUrl", e.target.value)}
                  disabled={saving || readOnly}
                  placeholder="https://ejemplo.com/imagen.jpg"
                  maxLength={MAX_URL_LENGTH + 100}
                />
                {form.thumbnailUrl.length > MAX_URL_LENGTH && (
                  <span className={styles.fieldHint}>Máx. {MAX_URL_LENGTH} caracteres. Use un enlace directo a la imagen.</span>
                )}
              </label>

              <label className={styles.field}>
                <span>URL de video / preview</span>
                <input
                  type="text"
                  value={form.previewUrl}
                  onChange={e => handleChange("previewUrl", e.target.value)}
                  disabled={saving || readOnly}
                  placeholder="https://..."
                  maxLength={MAX_URL_LENGTH + 100}
                />
                {form.previewUrl.length > MAX_URL_LENGTH && (
                  <span className={styles.fieldHint}>Máx. {MAX_URL_LENGTH} caracteres.</span>
                )}
              </label>

              <label className={styles.field}>
                <span>Temas del curso (uno por línea)</span>
                <textarea
                  rows="3"
                  value={form.topics}
                  onChange={e => handleChange("topics", e.target.value)}
                  disabled={saving || readOnly}
                />
              </label>

              <label className={styles.field}>
                <span>Lo que aprenderá el alumno (uno por línea)</span>
                <textarea
                  rows="3"
                  value={form.learnings}
                  onChange={e => handleChange("learnings", e.target.value)}
                  disabled={saving || readOnly}
                />
              </label>

              <label className={styles.field}>
                <span>Requisitos previos (uno por línea)</span>
                <textarea
                  rows="3"
                  value={form.requirements}
                  onChange={e => handleChange("requirements", e.target.value)}
                  disabled={saving || readOnly}
                />
              </label>

              <label className={styles.checkbox}>
                <input
                  type="checkbox"
                  checked={form.includesCertificate}
                  onChange={e => handleChange("includesCertificate", e.target.checked)}
                  disabled={saving || readOnly}
                />
                <span>Incluye certificado de finalización</span>
              </label>
            </div>
          </div>

          {!readOnly && (
            <div className={styles.footer}>
              <button
                type="button"
                className={styles.btnCancel}
                onClick={onClose}
                disabled={saving}
              >
                Cancelar
              </button>
              <button
                type="submit"
                className={styles.btnSave}
                disabled={saving}
              >
                <FiSave size={14} />
                {saving ? "Guardando..." : "Guardar curso"}
              </button>
            </div>
          )}
        </form>
      </div>
    </div>
  )
}


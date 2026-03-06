import { FiSearch, FiFilter, FiEye, FiEdit2, FiToggleLeft, FiToggleRight } from "react-icons/fi"
import styles from "./GestionTab.module.css"

const LEVEL_LABELS = {
  Básico: "Básico",
  Intermedio: "Intermedio",
  Avanzado: "Avanzado",
}

export default function GestionTab({
  courses,
  loading,
  search, setSearch,
  category, setCategory, categories,
  level, setLevel, levels,
  showAll, setShowAll,
  onCreate,
  onView,
  onEdit,
  onToggleActive,
}) {
  return (
    <div className={styles.wrapper}>
      <div className={styles.toolbar}>
        <div className={styles.searchWrapper}>
          <FiSearch size={13} className={styles.searchIcon} />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            className={styles.searchInput}
            placeholder="Buscar por título o instructor..."
          />
        </div>

        <div className={styles.filters}>
          <div className={styles.filterGroup}>
            <span className={styles.filterLabel}><FiFilter size={11} /> Categoría</span>
            <select
              value={category}
              onChange={e => setCategory(e.target.value)}
              className={styles.select}
            >
              {categories.map(c => (
                <option key={c} value={c}>{c === "todas" ? "Todas las categorías" : c}</option>
              ))}
            </select>
          </div>

          <div className={styles.filterGroup}>
            <span className={styles.filterLabel}><FiFilter size={11} /> Nivel</span>
            <select
              value={level}
              onChange={e => setLevel(e.target.value)}
              className={styles.select}
            >
              {levels.map(l => (
                <option key={l} value={l}>{l === "todos" ? "Todos los niveles" : LEVEL_LABELS[l] || l}</option>
              ))}
            </select>
          </div>

          <label className={styles.toggleAll}>
            <input
              type="checkbox"
              checked={showAll}
              onChange={e => setShowAll(e.target.checked)}
            />
            <span>Mostrar cursos inactivos</span>
          </label>

          <button className={styles.btnNew} onClick={onCreate}>
            + Nuevo curso
          </button>
        </div>
      </div>

      {loading ? (
        <div className={styles.loading}>Cargando cursos...</div>
      ) : courses.length === 0 ? (
        <div className={styles.empty}>
          <p className={styles.emptyTitle}>No hay cursos que coincidan con los filtros.</p>
          <p className={styles.emptySub}>Intenta ajustar la búsqueda o crea un nuevo curso.</p>
        </div>
      ) : (
        <div className={styles.tableWrapper}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th className={styles.th}>Curso</th>
                <th className={styles.th}>Categoría</th>
                <th className={styles.th}>Nivel</th>
                <th className={styles.th}>Precio</th>
                <th className={styles.th}>Estudiantes</th>
                <th className={styles.th}>Estado</th>
                <th className={styles.th}>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {courses.map(course => (
                <tr key={course.id} className={styles.row}>
                  <td className={styles.td}>
                    <div className={styles.courseCell}>
                      <div className={styles.thumbnail}>
                        {course.thumbnailUrl
                          ? <img src={course.thumbnailUrl} alt={course.title} />
                          : <span>{course.title[0]}</span>
                        }
                      </div>
                      <div>
                        <div className={styles.courseTitle}>{course.title}</div>
                        <div className={styles.courseMeta}>
                          {course.duration || "Duración no definida"}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className={`${styles.td} ${styles.muted}`}>{course.category}</td>
                  <td className={`${styles.td} ${styles.badgeLevel}`}>{LEVEL_LABELS[course.level] || course.level}</td>
                  <td className={`${styles.td} ${styles.muted}`}>
                    S/ {course.price.toFixed(2)}
                  </td>
                  <td className={styles.td}>
                    <span className={styles.badgeStudents}>
                      {course.studentsCount ?? 0} alumnos
                    </span>
                  </td>
                  <td className={styles.td}>
                    <span
                      className={styles.statusBadge}
                      data-active={course.isActive ? "true" : "false"}
                    >
                      {course.isActive ? "Activo" : "Inactivo"}
                    </span>
                  </td>
                  <td className={styles.td}>
                    <div className={styles.actions}>
                      <button
                        className={styles.actionBtn}
                        onClick={() => onView?.(course)}
                        title="Ver detalle"
                      >
                        <FiEye size={13} />
                      </button>
                      <button
                        className={styles.actionBtn}
                        onClick={() => onEdit?.(course)}
                        title="Editar"
                      >
                        <FiEdit2 size={13} />
                      </button>
                      <button
                        className={styles.actionBtn}
                        onClick={() => onToggleActive?.(course)}
                        title={course.isActive ? "Desactivar" : "Activar"}
                      >
                        {course.isActive ? <FiToggleLeft size={16} /> : <FiToggleRight size={16} />}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}


import { useState } from "react"
import { FiBookOpen, FiBarChart2 } from "react-icons/fi"
import { ToastContainer, useToast } from "../../../../components/ui/Toast"
import GestionTab from "./components/GestionTab"
import VentasTab from "./components/VentasTab"
import CourseModal from "./components/CourseModal"
import { useCursos } from "./hooks/useCursos"
import styles from "./CursosPage.module.css"

const TABS = [
  { id: "gestion", label: "Gestión de cursos", Icon: FiBookOpen },
  { id: "ventas",  label: "Ventas y métricas", Icon: FiBarChart2 },
]

export default function CursosPage() {
  const [activeTab, setActiveTab] = useState("gestion")

  const {
    loading,
    search, setSearch,
    category, setCategory,
    level, setLevel,
    showAll, setShowAll,
    filteredCourses,
    categories,
    levels,
    toggleActive,
    upsertCourse,
  } = useCursos()

  const [modal, setModal] = useState({ open: false, mode: "add", course: null })

  const { toasts, addToast, removeToast } = useToast()

  const openModal = (mode, course = null) => {
    setModal({ open: true, mode, course })
  }

  const closeModal = () => {
    setModal(m => ({ ...m, open: false }))
  }

  const handleToggleActive = async (course) => {
    try {
      const isActive = await toggleActive(course)
      addToast({
        type: isActive ? "success" : "warning",
        message: {
          title: isActive ? "Curso activado" : "Curso desactivado",
          body:  `${course.title} ahora está ${isActive ? "visible en el catálogo" : "oculto para los clientes"}.`,
        },
      })
    } catch (err) {
      addToast({ type: "error", message: err.message || "No se pudo cambiar el estado del curso" })
    }
  }

  const handleCourseSaved = ({ mode, course }) => {
    upsertCourse(course, mode)

    addToast({
      type: "success",
      message: {
        title: mode === "add" ? "Curso creado" : "Curso actualizado",
        body:  mode === "add"
          ? `El curso "${course.title}" fue creado correctamente.`
          : `Los cambios en "${course.title}" fueron guardados.`,
      },
    })
  }

  return (
    <>
      <ToastContainer toasts={toasts} removeToast={removeToast} />

      <div className={styles.page}>
        <div className={styles.header}>
          <div>
            <h1 className={styles.title}>Cursos Online</h1>
            <p className={styles.subtitle}>
              Administración de catálogo de cursos y análisis de ventas
            </p>
          </div>

          <div className={styles.headerActions}>
            <button
              className={styles.btnOutline}
              onClick={() => setActiveTab("ventas")}
            >
              <FiBarChart2 size={14} /> Ver métricas
            </button>
            <button
              className={styles.btnPrimary}
              onClick={() => openModal("add")}
            >
              <FiBookOpen size={14} /> Nuevo curso
            </button>
          </div>
        </div>

        <div className={styles.tabs}>
          {TABS.map(({ id, label, Icon }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className={`${styles.tab} ${activeTab === id ? styles.tabActive : ""}`}
            >
              <span className={styles.tabIcon}><Icon size={14} /></span>
              {label}
            </button>
          ))}
        </div>

        <div className={styles.content}>
          {activeTab === "gestion" ? (
            <GestionTab
              courses={filteredCourses}
              loading={loading}
              search={search}
              setSearch={setSearch}
              category={category}
              setCategory={setCategory}
              categories={categories}
              level={level}
              setLevel={setLevel}
              levels={levels}
              showAll={showAll}
              setShowAll={setShowAll}
              onCreate={() => openModal("add")}
              onView={course => openModal("view", course)}
              onEdit={course => openModal("edit", course)}
              onToggleActive={handleToggleActive}
            />
          ) : (
            <VentasTab />
          )}
        </div>
      </div>

      <CourseModal
        isOpen={modal.open}
        mode={modal.mode}
        course={modal.course}
        onClose={closeModal}
        onSuccess={handleCourseSaved}
        onError={(message) =>
          addToast({
            type: "error",
            duration: 8000,
            message: typeof message === "string" ? { title: "Error al guardar el curso", body: message } : message,
          })
        }
      />
    </>
  )
}


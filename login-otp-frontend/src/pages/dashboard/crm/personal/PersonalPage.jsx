import { useState } from "react"
import { FiDownload, FiUserPlus } from "react-icons/fi"
import RrhhTabs from "../../../../components/ui/RrhhTabs"
import PersonalStats from "./components/PersonalStats"
import PersonalFilters from "./components/PersonalFilters"
import PersonalGallery from "./components/PersonalGallery"
import PersonalTable from "./components/PersonalTable"
import AddEmployeeModal from "./components/AddEmployeeModal"
import DebugPanel from "../../../../components/ui/DebugPanel"
import { useEffect } from "react"
import { ToastContainer, useToast } from "../../../../components/ui/Toast"
import { usePersonal } from "./hooks/usePersonal"
import styles from "./PersonalPage.module.css"

export default function PersonalPage({ setActive }) {
  const [viewTab, setViewTab] = useState("gallery")
  const [showModal, setShowModal] = useState(false)
  const [showDebug, setShowDebug] = useState(false)
  const { toasts, addToast, removeToast } = useToast()

  const {
    employees, stats, loading,
    search, setSearch,
    filterType, setFilterType,
    filterStatus, setFilterStatus,
    addEmployee,
  } = usePersonal()
  const handleEmployeeCreated = ({ employee, tempPassword }) => {
    addEmployee(employee)

    addToast({
      type: "success",
      duration: 12000,
      message: {
        title: `Empleado creado exitosamente`,
        body: `Contraseña temporal: ${tempPassword} — Se ha enviado al correo ${employee.email}. Guarde esta información.`,
      },
    })
  }

  // Atajo para diagnóstico: Ctrl + Shift + D
  useEffect(() => {
    const handleKey = (e) => {
      if (e.ctrlKey && e.shiftKey && e.key.toLowerCase() === 'd') {
        e.preventDefault()
        setShowDebug(prev => !prev)
      }
    }
    window.addEventListener("keydown", handleKey)
    return () => window.removeEventListener("keydown", handleKey)
  }, [])

  return (
    <>
      <ToastContainer toasts={toasts} removeToast={removeToast} />

      <div className={styles.page}>
        <RrhhTabs mainTab="rrhh" subTab="personal" setActive={setActive} />

        {/* Header */}
        <div className={styles.header}>
          <div>
            <h1 className={styles.title}>Recursos Humanos</h1>
            <p className={styles.subtitle}>Gestión de personal y empleados</p>
          </div>
          <div className={styles.headerActions}>
            <button className={styles.btnOutline}>
              <FiDownload size={13} /> Exportar
            </button>
            <button className={styles.btnPrimary} onClick={() => setShowModal(true)}>
              <FiUserPlus size={13} /> Agregar Empleado
            </button>
          </div>
        </div>

        {/* Estadísticas */}
        <PersonalStats stats={stats} />

        {/* Tabs galería / tabla */}
        <div className={styles.viewTabs}>
          {[
            { id: "gallery", label: "Galería de Fotos" },
            { id: "table", label: "Tabla Detallada" },
          ].map(t => (
            <button
              key={t.id}
              onClick={() => setViewTab(t.id)}
              className={`${styles.viewTab} ${viewTab === t.id ? styles.viewTabActive : ""}`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Contenido */}
        <div className={styles.content}>
          <PersonalFilters
            search={search} setSearch={setSearch}
            filterType={filterType} setFilterType={setFilterType}
            filterStatus={filterStatus} setFilterStatus={setFilterStatus}
          />

          {loading
            ? <p className={styles.loading}>Cargando...</p>
            : viewTab === "gallery"
              ? <PersonalGallery employees={employees} />
              : <PersonalTable employees={employees} />
          }
        </div>

        <AddEmployeeModal
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          onEmployeeCreated={handleEmployeeCreated}
        />

        <DebugPanel
          isOpen={showDebug}
          onClose={() => setShowDebug(false)}
        />
      </div>
    </>
  )
}
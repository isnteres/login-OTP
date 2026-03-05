import { useState } from "react"
import { FiDownload, FiUserPlus } from "react-icons/fi"
import RrhhTabs from "../../../../components/ui/RrhhTabs"
import PersonalStats from "./components/PersonalStats"
import PersonalFilters from "./components/PersonalFilters"
import PersonalGallery from "./components/PersonalGallery"
<<<<<<< HEAD
import PersonalTable from "./components/PersonalTable"
import AddEmployeeModal from "./components/AddEmployeeModal"
import DebugPanel from "../../../../components/ui/DebugPanel"
import { useEffect } from "react"
=======
import PersonalTable   from "./components/PersonalTable"
import EmployeeModal   from "./components/EmployeeModal"
>>>>>>> 3924202a24e5cb3bac634045dd8f477585ee1aea
import { ToastContainer, useToast } from "../../../../components/ui/Toast"
import { usePersonal } from "./hooks/usePersonal"
import { employeeService } from "../../../../services/employeeService"
import styles from "./PersonalPage.module.css"

export default function PersonalPage({ setActive }) {
  const [viewTab, setViewTab] = useState("gallery")
<<<<<<< HEAD
  const [showModal, setShowModal] = useState(false)
  const [showDebug, setShowDebug] = useState(false)
=======
  const [modal,   setModal]   = useState({ open: false, mode: "add", employee: null })
>>>>>>> 3924202a24e5cb3bac634045dd8f477585ee1aea
  const { toasts, addToast, removeToast } = useToast()

  const {
    employees, stats, loading,
    search, setSearch,
    filterType, setFilterType,
    filterStatus, setFilterStatus,
    refetch,
  } = usePersonal()

<<<<<<< HEAD
    addToast({
      type: "success",
      duration: 12000,
      message: {
        title: `Empleado creado exitosamente`,
        body: `Contraseña temporal: ${tempPassword} — Se ha enviado al correo ${employee.email}. Guarde esta información.`,
      },
    })
=======
  const openModal = (mode, employee = null) => setModal({ open: true, mode, employee })
  const closeModal = () => setModal(m => ({ ...m, open: false }))

  const handleSuccess = async ({ mode, employee, tempPassword }) => {
    await refetch()
    if (mode === "add") {
      addToast({
        type: "success", duration: 12000,
        message: {
          title: "Empleado creado exitosamente",
          body:  `Contraseña temporal: ${tempPassword} — Enviada al correo ${employee.email}. Guardá esta información.`,
        },
      })
    } else if (mode === "edit") {
      addToast({ type: "success", duration: 4000, message: { title: "Empleado actualizado", body: `Los datos de ${employee.name} fueron guardados.` } })
    }
  }

  const handleToggleBlock = async (emp) => {
    try {
      const { status } = await employeeService.toggleBlock(emp.id)
      await refetch()
      addToast({
        type: status === "Bloqueado" ? "warning" : "success",
        duration: 4000,
        message: {
          title: status === "Bloqueado" ? "Empleado bloqueado" : "Empleado desbloqueado",
          body:  `${emp.name} ahora está ${status.toLowerCase()}.`,
        },
      })
    } catch (err) {
      addToast({ type: "error", duration: 4000, message: { title: "Error", body: err.message } })
    }
  }

  const handleDelete = async (emp) => {
    if (!window.confirm(`¿Eliminár a ${emp.name}? Esta acción no se puede deshacer.`)) return
    try {
      await employeeService.remove(emp.id)
      await refetch()
      addToast({ type: "success", duration: 4000, message: { title: "Empleado eliminado", body: `${emp.name} fue eliminado del sistema.` } })
    } catch (err) {
      addToast({ type: "error", duration: 4000, message: { title: "Error", body: err.message } })
    }
>>>>>>> 3924202a24e5cb3bac634045dd8f477585ee1aea
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

        <div className={styles.header}>
          <div>
            <h1 className={styles.title}>Recursos Humanos</h1>
            <p className={styles.subtitle}>Gestión de personal y empleados</p>
          </div>
          <div className={styles.headerActions}>
            <button className={styles.btnOutline}><FiDownload size={13} /> Exportar</button>
            <button className={styles.btnPrimary} onClick={() => openModal("add")}>
              <FiUserPlus size={13} /> Agregar Empleado
            </button>
          </div>
        </div>

        <PersonalStats stats={stats} />

        <div className={styles.viewTabs}>
<<<<<<< HEAD
          {[
            { id: "gallery", label: "Galería de Fotos" },
            { id: "table", label: "Tabla Detallada" },
          ].map(t => (
            <button
              key={t.id}
              onClick={() => setViewTab(t.id)}
              className={`${styles.viewTab} ${viewTab === t.id ? styles.viewTabActive : ""}`}
            >
=======
          {[{ id:"gallery", label:"Galería de Fotos" }, { id:"table", label:"Tabla Detallada" }].map(t => (
            <button key={t.id} onClick={() => setViewTab(t.id)}
              className={`${styles.viewTab} ${viewTab === t.id ? styles.viewTabActive : ""}`}>
>>>>>>> 3924202a24e5cb3bac634045dd8f477585ee1aea
              {t.label}
            </button>
          ))}
        </div>

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
<<<<<<< HEAD
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
=======
              : <PersonalTable
                  employees={employees}
                  onView={emp         => openModal("view", emp)}
                  onEdit={emp         => openModal("edit", emp)}
                  onToggleBlock={emp  => handleToggleBlock(emp)}
                  onDelete={emp       => handleDelete(emp)}
                />
          }
        </div>
>>>>>>> 3924202a24e5cb3bac634045dd8f477585ee1aea
      </div>

      <EmployeeModal
        isOpen={modal.open}
        mode={modal.mode}
        employee={modal.employee}
        onClose={closeModal}
        onSuccess={handleSuccess}
      />
    </>
  )
}
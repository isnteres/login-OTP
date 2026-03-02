import { useState } from "react";
import { FiDownload, FiUserPlus } from "react-icons/fi";
import RrhhTabs from "../../../../components/ui/RrhhTabs";
import PersonalStats from "./components/PersonalStats";
import PersonalFilters from "./components/PersonalFilters";
import PersonalGallery from "./components/PersonalGallery";
import PersonalTable from "./components/PersonalTable";
import AddEmployeeModal from "./components/AddEmployeeModal";
import { usePersonal } from "./hooks/usePersonal";
import styles from "./PersonalPage.module.css";

export default function PersonalPage({ setActive }) {
  const [viewTab, setViewTab] = useState("gallery");
  const [showModal, setShowModal] = useState(false);
  const [selectedEmp, setSelectedEmp] = useState(null);

  const {
    employees,
    stats,
    loading,
    error,
    search,
    setSearch,
    filterType,
    setFilterType,
    filterStatus,
    setFilterStatus,
    addEmployee,
    changeStatus,
    removeEmployee,
  } = usePersonal();

  return (
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
          <button
            className={styles.btnPrimary}
            onClick={() => setShowModal(true)}
          >
            <FiUserPlus size={13} /> Agregar Empleado
          </button>
        </div>
      </div>

      {/* Error global */}
      {error && (
        <div
          style={{
            background: "#fee2e2",
            border: "1px solid #fca5a5",
            padding: "12px 16px",
            borderRadius: "8px",
            margin: "0 0 16px",
            color: "#dc2626",
            fontSize: "14px",
          }}
        >
          {error}
        </div>
      )}

      {/* Estadísticas */}
      <PersonalStats stats={stats} />

      {/* Tabs galería / tabla */}
      <div className={styles.viewTabs}>
        {[
          { id: "gallery", label: "Galería de Fotos" },
          { id: "table", label: "Tabla Detallada" },
        ].map((t) => (
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
          search={search}
          setSearch={setSearch}
          filterType={filterType}
          setFilterType={setFilterType}
          filterStatus={filterStatus}
          setFilterStatus={setFilterStatus}
        />

        {loading ? (
          <p className={styles.loading}>Cargando...</p>
        ) : viewTab === "gallery" ? (
          <PersonalGallery employees={employees} />
        ) : (
          <PersonalTable
            employees={employees}
            onChangeStatus={changeStatus}
            onDelete={removeEmployee}
            onView={(emp) => setSelectedEmp(emp)}
          />
        )}
      </div>

      {/* Modal agregar empleado */}
      <AddEmployeeModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onSubmit={addEmployee}
      />

      {/* Modal ver detalle */}
      {selectedEmp && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.6)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
          }}
          onClick={() => setSelectedEmp(null)}
        >
          <div
            style={{
              background: "#1e293b",
              borderRadius: "12px",
              padding: "32px",
              minWidth: "360px",
              maxWidth: "480px",
              width: "100%",
              border: "1px solid rgba(255,255,255,0.08)",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h3
              style={{ color: "white", margin: "0 0 20px", fontSize: "18px" }}
            >
              Detalle del Empleado
            </h3>
            <div
              style={{ display: "flex", flexDirection: "column", gap: "12px" }}
            >
              {[
                ["Nombre", selectedEmp.name],
                ["Email", selectedEmp.email],
                ["Tipo", selectedEmp.type],
                ["Puesto", selectedEmp.position || "N/A"],
                ["Departamento", selectedEmp.department || "—"],
                ["Estado", selectedEmp.status],
                ["Teléfono", selectedEmp.phone || "—"],
                ["Especialidad", selectedEmp.specialty || "—"],
              ].map(([label, value]) => (
                <div
                  key={label}
                  style={{ display: "flex", justifyContent: "space-between" }}
                >
                  <span
                    style={{ color: "rgba(255,255,255,0.4)", fontSize: "13px" }}
                  >
                    {label}
                  </span>
                  <span
                    style={{
                      color: "white",
                      fontSize: "13px",
                      fontWeight: 500,
                    }}
                  >
                    {value}
                  </span>
                </div>
              ))}
            </div>
            <button
              onClick={() => setSelectedEmp(null)}
              style={{
                marginTop: "24px",
                width: "100%",
                padding: "10px",
                background: "rgba(255,255,255,0.06)",
                border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: "8px",
                color: "white",
                cursor: "pointer",
                fontSize: "14px",
              }}
            >
              Cerrar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

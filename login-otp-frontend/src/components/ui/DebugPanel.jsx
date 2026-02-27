import { useState, useEffect } from "react"
import { FiCheckCircle, FiXCircle, FiActivity, FiRefreshCw } from "react-icons/fi"
import { employeeService } from "../../services/employeeService"

export default function DebugPanel({ isOpen, onClose }) {
    const [data, setData] = useState(null)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)

    const fetchDiagnostics = async () => {
        try {
            setLoading(true)
            setError(null)
            const res = await employeeService.getDiagnostics()
            setData(res)
        } catch (err) {
            setError(err.message || "Error al obtener diagnóstico")
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        if (isOpen) fetchDiagnostics()
    }, [isOpen])

    if (!isOpen) return null

    const renderCheck = (val) => val === true
        ? <FiCheckCircle color="#10b981" size={16} />
        : <FiXCircle color="#ef4444" size={16} />;

    return (
        <div style={{
            position: "fixed", top: 0, left: 0, width: "100%", height: "100%",
            background: "rgba(0,0,0,0.85)", backdropFilter: "blur(8px)",
            display: "flex", justifyContent: "center", alignItems: "center", zIndex: 9999
        }}>
            <div style={{
                background: "#1e1e2e", width: "90%", maxWidth: "600px", borderRadius: "16px",
                border: "1px solid rgba(255,255,255,0.1)", padding: "24px", color: "#eef2ff"
            }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "20px" }}>
                    <h2 style={{ display: "flex", alignItems: "center", gap: "10px", margin: 0 }}>
                        <FiActivity color="#6366f1" /> Diagnóstico Técnico HR
                    </h2>
                    <div style={{ display: "flex", gap: "12px" }}>
                        <button
                            onClick={fetchDiagnostics}
                            style={{ background: "none", border: "none", color: "#818cf8", cursor: "pointer" }}
                            title="Recargar"
                        >
                            <FiRefreshCw className={loading ? "spin" : ""} />
                        </button>
                        <button onClick={onClose} style={{ background: "none", border: "none", color: "#f87171", cursor: "pointer", fontSize: "18px" }}>×</button>
                    </div>
                </div>

                {loading && <p style={{ color: "rgba(255,255,255,0.5)" }}>Ejecutando pruebas...</p>}
                {error && <p style={{ color: "#f87171" }}>Error: {error}</p>}

                {data && (
                    <div style={{ display: "flex", flexDirection: "column", gap: "16px", maxHeight: "60vh", overflowY: "auto", paddingRight: "10px" }}>

                        {/* Rutas */}
                        <section>
                            <h3 style={{ fontSize: "14px", color: "#818cf8", margin: "0 0 8px 0", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>Rutas (API CRM)</h3>
                            <div style={sectionStyle}>
                                <div style={itemStyle}><span>GET /api/crm/employees</span> {renderCheck(data.routes.employees_index)}</div>
                                <div style={itemStyle}><span>POST /api/crm/employees</span> {renderCheck(data.routes.employees_store)}</div>
                                <div style={itemStyle}><span>GET /api/crm/hr-diagnostics</span> {renderCheck(data.routes.diagnostics)}</div>
                            </div>
                        </section>

                        {/* Base de Datos */}
                        <section>
                            <h3 style={{ fontSize: "14px", color: "#818cf8", margin: "0 0 8px 0", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>Base de Datos</h3>
                            <div style={sectionStyle}>
                                <div style={itemStyle}><span>Columnas en 'users'</span> {renderCheck(data.database.users_columns_ok)}</div>
                                <div style={itemStyle}><span>Llaves Foráneas</span> {renderCheck(data.database.foreign_keys_ok)}</div>
                                <div style={itemStyle}><span>Índices</span> {renderCheck(data.database.indexes_ok)}</div>
                            </div>
                        </section>

                        {/* Catálogos */}
                        <section>
                            <h3 style={{ fontSize: "14px", color: "#818cf8", margin: "0 0 8px 0", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>Catálogos (Seeders)</h3>
                            <div style={sectionStyle}>
                                <div style={itemStyle}><span>Departamentos</span> {renderCheck(data.catalogs.departments_seeded)}</div>
                                <div style={itemStyle}><span>Tipos de Empleado</span> {renderCheck(data.catalogs.employee_types_seeded)}</div>
                                <div style={itemStyle}><span>Puestos (Positions)</span> {renderCheck(data.catalogs.positions_seeded)}</div>
                            </div>
                        </section>

                        {/* Relaciones */}
                        <section>
                            <h3 style={{ fontSize: "14px", color: "#818cf8", margin: "0 0 8px 0", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>Relaciones Eloquent</h3>
                            <div style={sectionStyle}>
                                <div style={itemStyle}><span>User ↔ Department</span> {renderCheck(data.relationships.user_department_relation)}</div>
                                <div style={itemStyle}><span>User ↔ Position</span> {renderCheck(data.relationships.user_position_relation)}</div>
                            </div>
                        </section>

                    </div>
                )}
            </div>

            <style>{`
        .spin { animation: spin 1s linear infinite; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
        </div>
    )
}

const sectionStyle = {
    display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px"
}

const itemStyle = {
    fontSize: "12px", background: "rgba(255,255,255,0.03)", padding: "8px 12px",
    borderRadius: "6px", display: "flex", justifyContent: "space-between", alignItems: "center"
}

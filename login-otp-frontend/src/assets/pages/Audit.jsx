import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const API_URL = "http://localhost:8000/api";

export default function Audit() {
  const navigate = useNavigate();
  const [summary, setSummary] = useState(null);
  const [logs, setLogs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [summaryRes, logsRes] = await Promise.all([
        fetch(`${API_URL}/audit/summary`, {
          headers: { Accept: "application/json" },
        }),
        fetch(`${API_URL}/audit/logs`, {
          headers: { Accept: "application/json" },
        }),
      ]);
      setSummary(await summaryRes.json());
      const logsData = await logsRes.json();
      setLogs(logsData.data || []);
    } catch (err) {
      console.error("Error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusColor = (s) =>
    ({ success: "#22c55e", failed: "#ef4444" })[s] || "#f59e0b";
  const getStatusLabel = (s) =>
    ({ success: "Exitoso", failed: "Fallido" })[s] || "Pendiente";
  const getActionLabel = (action) =>
    ({
      registro_otp_enviado: "OTP registro enviado",
      registro_otp_verificado: "OTP registro verificado",
      registro_otp_fallido: "OTP registro fallido",
      registro_completado: "Registro completado",
      registro_intento: "Intento de registro",
      login_otp_enviado: "OTP login enviado",
      login_otp_fallido: "OTP login fallido",
      login_exitoso: "Login exitoso",
      login_fallido: "Login fallido",
    })[action] || action;

  const cards = summary
    ? [
        {
          label: "Usuarios",
          value: summary.total_usuarios,
          icon: "👤",
          color: "#6366f1",
        },
        {
          label: "Eventos",
          value: summary.total_eventos,
          icon: "📋",
          color: "#8b5cf6",
        },
        {
          label: "Logins OK",
          value: summary.logins_exitosos,
          icon: "✅",
          color: "#22c55e",
        },
        {
          label: "Logins fallidos",
          value: summary.logins_fallidos,
          icon: "❌",
          color: "#ef4444",
        },
        {
          label: "OTPs fallidos",
          value: summary.otps_fallidos,
          icon: "⚠️",
          color: "#f59e0b",
        },
        {
          label: "Registros",
          value: summary.registros_completados,
          icon: "🎉",
          color: "#10b981",
        },
      ]
    : [];

  return (
    <div
      style={{
        minHeight: "100vh",
        width: "100%",
        background:
          "linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%)",
        overflowY: "auto",
        overflowX: "hidden",
        fontFamily: "'DM Sans', sans-serif",
      }}
    >
      {/* Orbs fijos de fondo */}
      <div
        style={{
          position: "fixed",
          inset: 0,
          pointerEvents: "none",
          zIndex: 0,
        }}
      >
        <div
          style={{
            position: "absolute",
            width: "500px",
            height: "500px",
            borderRadius: "50%",
            background: "rgba(99,102,241,0.15)",
            filter: "blur(100px)",
            top: "-150px",
            left: "-150px",
          }}
        />
        <div
          style={{
            position: "absolute",
            width: "400px",
            height: "400px",
            borderRadius: "50%",
            background: "rgba(16,185,129,0.1)",
            filter: "blur(80px)",
            bottom: 0,
            right: "-100px",
          }}
        />
      </div>

      {/* Contenido */}
      <div
        style={{
          position: "relative",
          zIndex: 1,
          maxWidth: "1000px",
          margin: "0 auto",
          padding: "32px 24px 64px",
        }}
      >
        {/* Header */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "32px",
            gap: "16px",
          }}
        >
          <div>
            <h1
              style={{
                color: "white",
                fontSize: "22px",
                fontWeight: "700",
                margin: 0,
              }}
            >
              🛡️ Panel de Auditoría
            </h1>
            <p
              style={{
                color: "rgba(255,255,255,0.45)",
                fontSize: "13px",
                marginTop: "4px",
                marginBottom: 0,
              }}
            >
              Monitoreo de seguridad
            </p>
          </div>
          <div style={{ display: "flex", gap: "10px", flexShrink: 0 }}>
            <button
              onClick={fetchData}
              style={{
                background: "linear-gradient(135deg, #6366f1, #4f46e5)",
                border: "none",
                color: "white",
                padding: "10px 18px",
                borderRadius: "10px",
                cursor: "pointer",
                fontSize: "13px",
                fontWeight: "600",
                whiteSpace: "nowrap",
              }}
            >
              🔄 Actualizar
            </button>
            <button
              onClick={() => navigate("/dashboard")}
              style={{
                background: "rgba(255,255,255,0.1)",
                border: "1px solid rgba(255,255,255,0.2)",
                color: "white",
                padding: "10px 18px",
                borderRadius: "10px",
                cursor: "pointer",
                fontSize: "13px",
                fontWeight: "500",
                whiteSpace: "nowrap",
              }}
            >
              ← Volver
            </button>
          </div>
        </div>

        {isLoading ? (
          <div
            style={{
              color: "rgba(255,255,255,0.5)",
              textAlign: "center",
              padding: "80px",
              fontSize: "15px",
            }}
          >
            ⏳ Cargando...
          </div>
        ) : (
          <>
            {/* Tarjetas en una sola fila */}
            {summary && (
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(6, 1fr)",
                  gap: "12px",
                  marginBottom: "28px",
                }}
              >
                {cards.map((card) => (
                  <div
                    key={card.label}
                    style={{
                      background: "rgba(255,255,255,0.06)",
                      backdropFilter: "blur(16px)",
                      borderRadius: "14px",
                      padding: "16px 12px",
                      textAlign: "center",
                      border: `1px solid ${card.color}33`,
                    }}
                  >
                    <div style={{ fontSize: "22px", marginBottom: "6px" }}>
                      {card.icon}
                    </div>
                    <div
                      style={{
                        color: card.color,
                        fontSize: "26px",
                        fontWeight: "700",
                        lineHeight: 1,
                      }}
                    >
                      {card.value}
                    </div>
                    <div
                      style={{
                        color: "rgba(255,255,255,0.5)",
                        fontSize: "10px",
                        marginTop: "6px",
                        textTransform: "uppercase",
                        letterSpacing: "0.04em",
                      }}
                    >
                      {card.label}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Tabla */}
            <div
              style={{
                background: "rgba(255,255,255,0.05)",
                backdropFilter: "blur(16px)",
                borderRadius: "16px",
                border: "1px solid rgba(255,255,255,0.1)",
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  padding: "16px 20px",
                  borderBottom: "1px solid rgba(255,255,255,0.08)",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <h2
                  style={{
                    color: "white",
                    fontSize: "14px",
                    fontWeight: "600",
                    margin: 0,
                  }}
                >
                  📋 Registro de eventos
                </h2>
                <span
                  style={{ color: "rgba(255,255,255,0.35)", fontSize: "12px" }}
                >
                  {logs.length} eventos
                </span>
              </div>

              <div style={{ overflowX: "auto" }}>
                <table
                  style={{
                    width: "100%",
                    borderCollapse: "collapse",
                    minWidth: "580px",
                  }}
                >
                  <thead>
                    <tr style={{ background: "rgba(0,0,0,0.15)" }}>
                      {["Fecha", "Email", "Acción", "Estado", "IP"].map(
                        (col) => (
                          <th
                            key={col}
                            style={{
                              padding: "11px 18px",
                              textAlign: "left",
                              color: "rgba(255,255,255,0.4)",
                              fontSize: "11px",
                              fontWeight: "700",
                              textTransform: "uppercase",
                              letterSpacing: "0.07em",
                            }}
                          >
                            {col}
                          </th>
                        ),
                      )}
                    </tr>
                  </thead>
                  <tbody>
                    {logs.length === 0 ? (
                      <tr>
                        <td
                          colSpan="5"
                          style={{
                            padding: "48px",
                            textAlign: "center",
                            color: "rgba(255,255,255,0.3)",
                          }}
                        >
                          No hay eventos registrados
                        </td>
                      </tr>
                    ) : (
                      logs.map((log, index) => (
                        <tr
                          key={log.id}
                          style={{
                            borderBottom: "1px solid rgba(255,255,255,0.05)",
                            background:
                              index % 2 === 0
                                ? "transparent"
                                : "rgba(255,255,255,0.02)",
                          }}
                        >
                          <td
                            style={{
                              padding: "13px 18px",
                              color: "rgba(255,255,255,0.55)",
                              fontSize: "12px",
                              whiteSpace: "nowrap",
                            }}
                          >
                            {new Date(log.created_at).toLocaleString("es-ES")}
                          </td>
                          <td
                            style={{
                              padding: "13px 18px",
                              color: "rgba(255,255,255,0.85)",
                              fontSize: "13px",
                            }}
                          >
                            {log.email || "—"}
                          </td>
                          <td
                            style={{
                              padding: "13px 18px",
                              color: "white",
                              fontSize: "13px",
                            }}
                          >
                            {getActionLabel(log.action)}
                          </td>
                          <td style={{ padding: "13px 18px" }}>
                            <span
                              style={{
                                background: getStatusColor(log.status) + "22",
                                color: getStatusColor(log.status),
                                border: `1px solid ${getStatusColor(log.status)}44`,
                                padding: "3px 10px",
                                borderRadius: "20px",
                                fontSize: "11px",
                                fontWeight: "700",
                                whiteSpace: "nowrap",
                              }}
                            >
                              {getStatusLabel(log.status)}
                            </span>
                          </td>
                          <td
                            style={{
                              padding: "13px 18px",
                              color: "rgba(255,255,255,0.35)",
                              fontSize: "12px",
                              fontFamily: "monospace",
                            }}
                          >
                            {log.ip_address || "—"}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

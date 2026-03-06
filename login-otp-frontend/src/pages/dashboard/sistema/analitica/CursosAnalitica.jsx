import { useEffect, useState } from "react";
import { getAnalitica } from "../../../../api/cursosApi";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

export default function CursosAnalitica() {
  const [stats, setStats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [hora, setHora] = useState(null);

  useEffect(() => {
    const fetch_ = () => {
      getAnalitica()
        .then((res) => {
          setStats(res.data);
          setHora(new Date().toLocaleTimeString());
        })
        .finally(() => setLoading(false));
    };
    fetch_();
    const iv = setInterval(fetch_, 1000);
    return () => clearInterval(iv);
  }, []);

  const resumen = stats.reduce((acc, s) => {
    const nombre = s.course?.title ?? `Curso #${s.course_id}`;
    const corto = nombre.length > 20 ? nombre.substring(0, 20) + "…" : nombre;
    if (!acc[corto]) acc[corto] = { nombre: corto, ver: 0, comprar: 0 };
    if (s.tipo_evento === "click_ver") acc[corto].ver = s.total;
    if (s.tipo_evento === "click_comprar") acc[corto].comprar = s.total;
    return acc;
  }, {});

  const chartData = Object.values(resumen);
  const totalClicks = stats.reduce((a, s) => a + s.total, 0);
  const totalVer = stats
    .filter((s) => s.tipo_evento === "click_ver")
    .reduce((a, s) => a + s.total, 0);
  const totalComprar = stats
    .filter((s) => s.tipo_evento === "click_comprar")
    .reduce((a, s) => a + s.total, 0);
  const maxTotal = Math.max(...stats.map((s) => s.total), 1);

  const CustomTooltip = ({ active, payload, label }) => {
    if (!active || !payload?.length) return null;
    return (
      <div
        style={{
          background: "rgba(15,23,42,0.95)",
          border: "1px solid rgba(99,102,241,0.3)",
          borderRadius: "10px",
          padding: "10px 14px",
          fontFamily: "'DM Sans',sans-serif",
        }}
      >
        <p
          style={{
            color: "#f8fafc",
            fontWeight: 700,
            marginBottom: "6px",
            fontSize: "13px",
          }}
        >
          {label}
        </p>
        {payload.map((p, i) => (
          <p
            key={i}
            style={{ color: p.color, fontSize: "12px", margin: "2px 0" }}
          >
            {p.name === "ver" ? "👁 Ver más" : "🎓 Inscrito"}:{" "}
            <strong>{p.value}</strong>
          </p>
        ))}
      </div>
    );
  };

  return (
    <div
      style={{
        padding: "32px 40px",
        minHeight: "100vh",
        fontFamily: "'DM Sans', sans-serif",
      }}
    >
      {/* Header */}
      <div style={{ marginBottom: "2rem" }}>
        <p
          style={{
            color: "rgba(99,102,241,0.8)",
            fontSize: "12px",
            fontWeight: 700,
            letterSpacing: "2px",
            textTransform: "uppercase",
            marginBottom: "6px",
          }}
        >
          Operaciones / Proyectos
        </p>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div>
            <h1
              style={{
                color: "#f8fafc",
                fontSize: "28px",
                fontWeight: 700,
                margin: 0,
              }}
            >
              Analítica de Cursos
            </h1>
            <p
              style={{
                color: "rgba(255,255,255,0.35)",
                fontSize: "14px",
                marginTop: "6px",
              }}
            >
              Clicks registrados en la landing page de ventas
            </p>
          </div>
          {hora && (
            <span
              style={{
                background: "rgba(16,185,129,0.1)",
                border: "1px solid rgba(16,185,129,0.2)",
                color: "#10b981",
                borderRadius: "20px",
                padding: "4px 14px",
                fontSize: "12px",
                fontWeight: 600,
              }}
            >
              ● LIVE — {hora}
            </span>
          )}
        </div>
      </div>

      {/* Tarjetas resumen */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(180px,1fr))",
          gap: "1rem",
          marginBottom: "2rem",
        }}
      >
        {[
          {
            label: "Total Clicks",
            value: totalClicks,
            color: "#f8fafc",
            bg: "rgba(255,255,255,0.04)",
          },
          {
            label: "Ver más",
            value: totalVer,
            color: "#a5b4fc",
            bg: "rgba(99,102,241,0.08)",
          },
          {
            label: "Inscripciones",
            value: totalComprar,
            color: "#10b981",
            bg: "rgba(16,185,129,0.08)",
          },
          {
            label: "Cursos activos",
            value: Object.keys(resumen).length,
            color: "#f59e0b",
            bg: "rgba(245,158,11,0.08)",
          },
        ].map((c, i) => (
          <div
            key={i}
            style={{
              background: c.bg,
              border: "1px solid rgba(255,255,255,0.06)",
              borderRadius: "14px",
              padding: "1.2rem",
              textAlign: "center",
              backdropFilter: "blur(10px)",
            }}
          >
            <div style={{ color: c.color, fontSize: "2rem", fontWeight: 900 }}>
              {c.value}
            </div>
            <div
              style={{
                color: "rgba(255,255,255,0.3)",
                fontSize: "11px",
                letterSpacing: "1px",
                marginTop: "4px",
                textTransform: "uppercase",
              }}
            >
              {c.label}
            </div>
          </div>
        ))}
      </div>

      {/* Gráfico */}
      <div
        style={{
          background: "rgba(15,23,42,0.6)",
          border: "1px solid rgba(255,255,255,0.07)",
          borderRadius: "16px",
          padding: "1.5rem",
          marginBottom: "1.5rem",
          backdropFilter: "blur(12px)",
        }}
      >
        <h2
          style={{
            color: "#f8fafc",
            fontSize: "13px",
            fontWeight: 700,
            letterSpacing: "1px",
            marginBottom: "1.2rem",
            textTransform: "uppercase",
          }}
        >
          📊 Clicks por curso
        </h2>

        {loading || chartData.length === 0 ? (
          <p
            style={{
              color: "rgba(255,255,255,0.2)",
              textAlign: "center",
              padding: "3rem 0",
              fontSize: "13px",
            }}
          >
            Sin datos aún — interactúa con los cursos en la landing
          </p>
        ) : (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart
              data={chartData}
              margin={{ top: 5, right: 10, left: 0, bottom: 70 }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="rgba(255,255,255,0.05)"
              />
              <XAxis
                dataKey="nombre"
                tick={{ fill: "rgba(255,255,255,0.3)", fontSize: 10 }}
                angle={-40}
                textAnchor="end"
                interval={0}
                height={75}
              />
              <YAxis
                tick={{ fill: "rgba(255,255,255,0.3)", fontSize: 11 }}
                allowDecimals={false}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend
                formatter={(v) => (
                  <span
                    style={{ color: "rgba(255,255,255,0.4)", fontSize: "12px" }}
                  >
                    {v === "ver" ? "👁 Ver más" : "🎓 Inscrito"}
                  </span>
                )}
              />
              <Bar dataKey="ver" fill="#6366f1" radius={[4, 4, 0, 0]} />
              <Bar dataKey="comprar" fill="#10b981" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>

      {/* Detalle por curso */}
      {Object.entries(resumen).length > 0 && (
        <>
          <h2
            style={{
              color: "#f8fafc",
              fontSize: "13px",
              fontWeight: 700,
              letterSpacing: "1px",
              textTransform: "uppercase",
              marginBottom: "1rem",
            }}
          >
            Detalle por curso
          </h2>
          <div
            style={{ display: "flex", flexDirection: "column", gap: "0.6rem" }}
          >
            {Object.entries(resumen).map(([nombre, clicks], i) => (
              <div
                key={i}
                style={{
                  background: "rgba(15,23,42,0.6)",
                  border: "1px solid rgba(255,255,255,0.06)",
                  borderRadius: "12px",
                  padding: "1rem 1.2rem",
                  backdropFilter: "blur(10px)",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginBottom: "0.6rem",
                  }}
                >
                  <span
                    style={{
                      color: "#f8fafc",
                      fontWeight: 600,
                      fontSize: "13px",
                    }}
                  >
                    {nombre}
                  </span>
                  <span
                    style={{
                      color: "#a5b4fc",
                      fontWeight: 700,
                      fontSize: "13px",
                    }}
                  >
                    {clicks.ver + clicks.comprar} clicks
                  </span>
                </div>
                {[
                  { label: "👁 Ver más", value: clicks.ver, color: "#6366f1" },
                  {
                    label: "🎓 Inscrito",
                    value: clicks.comprar,
                    color: "#10b981",
                  },
                ].map((b, j) => (
                  <div key={j} style={{ marginBottom: j === 0 ? "6px" : 0 }}>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        marginBottom: "3px",
                      }}
                    >
                      <span
                        style={{
                          color: b.color,
                          fontSize: "11px",
                          fontWeight: 600,
                        }}
                      >
                        {b.label}
                      </span>
                      <span style={{ color: b.color, fontSize: "11px" }}>
                        {b.value}
                      </span>
                    </div>
                    <div
                      style={{
                        background: "rgba(255,255,255,0.05)",
                        borderRadius: "4px",
                        height: "5px",
                      }}
                    >
                      <div
                        style={{
                          background: b.color,
                          height: "5px",
                          borderRadius: "4px",
                          width: `${(b.value / maxTotal) * 100}%`,
                          transition: "width 0.4s ease",
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

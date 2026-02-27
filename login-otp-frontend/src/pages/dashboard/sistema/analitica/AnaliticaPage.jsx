import {
  AreaChart, Area, XAxis, YAxis, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell,
} from "recharts"
import {
  FiGlobe, FiEye, FiActivity, FiUsers,
  FiTrendingUp, FiMonitor,
} from "react-icons/fi"
import { useAnalitica } from "./hooks/useAnalitica"
import styles from "./AnaliticaPage.module.css"

const STAT_CARDS = [
  { key: "totalVisitas",        label: "Total de Visitas",     sub: "Páginas vistas en el periodo", Icon: FiEye         },
  { key: "sesionesUnicas",      label: "Sesiones Únicas",      sub: "Visitantes por sesión",        Icon: FiActivity    },
  { key: "usuariosRegistrados", label: "Usuarios Registrados", sub: "Usuarios autenticados activos",Icon: FiUsers       },
  { key: "pagsPorSesion",       label: "Págs. por Sesión",     sub: "Promedio de navegación",       Icon: FiTrendingUp  },
]

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null
  return (
    <div className={styles.tooltip}>
      <p className={styles.tooltipLabel}>{label}</p>
      {payload.map(p => (
        <p key={p.dataKey} style={{ color: p.color }} className={styles.tooltipValue}>
          {p.dataKey === "vistas" ? "Vistas" : "Sesiones"}: {p.value}
        </p>
      ))}
    </div>
  )
}

export default function AnaliticaPage() {
  const { summary, traffic, topPages, devices, loading, period, setPeriod } = useAnalitica()
  const maxVisits = topPages.length ? Math.max(...topPages.map(p => p.visits)) : 1

  if (loading) {
    return <div className={styles.loadingScreen}>⏳ Cargando...</div>
  }

  return (
    <div className={styles.page}>

      {/* Header */}
      <div className={styles.header}>
        <div>
          <div className={styles.titleRow}>
            <span className={styles.titleIcon}><FiGlobe size={16} /></span>
            <h1 className={styles.title}>Analítica Web</h1>
          </div>
          <p className={styles.subtitle}>Interacciones de usuarios en toda la plataforma</p>
        </div>
        <select
          value={period}
          onChange={e => setPeriod(e.target.value)}
          className={styles.periodSelect}
        >
          <option value="7d">Últimos 7 días</option>
          <option value="30d">Últimos 30 días</option>
          <option value="mes">Este mes</option>
        </select>
      </div>

      {/* Stats */}
      <div className={styles.statsGrid}>
        {STAT_CARDS.map(({ key, label, sub, Icon }) => (
          <div key={key} className={styles.statCard}>
            <div className={styles.statTop}>
              <p className={styles.statLabel}>{label}</p>
              <span className={styles.statIcon}><Icon size={18} /></span>
            </div>
            <p className={styles.statValue}>{summary?.[key] ?? 0}</p>
            <p className={styles.statSub}>{sub}</p>
          </div>
        ))}
      </div>

      {/* Gráfico tráfico */}
      <div className={styles.chartBox}>
        <h2 className={styles.chartTitle}>Tráfico en el Tiempo</h2>
        <ResponsiveContainer width="100%" height={200}>
          <AreaChart data={traffic} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="colorVistas" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%"  stopColor="#6366f1" stopOpacity={0.25} />
                <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="colorSesiones" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%"  stopColor="#10b981" stopOpacity={0.2} />
                <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis dataKey="date" tick={{ fill: "rgba(255,255,255,0.3)", fontSize: 11 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: "rgba(255,255,255,0.3)", fontSize: 11 }} axisLine={false} tickLine={false} />
            <Tooltip content={<CustomTooltip />} />
            <Area type="monotone" dataKey="vistas"   stroke="#818cf8" strokeWidth={2} fill="url(#colorVistas)"   dot={false} />
            <Area type="monotone" dataKey="sesiones" stroke="#34d399" strokeWidth={2} fill="url(#colorSesiones)" dot={false} />
          </AreaChart>
        </ResponsiveContainer>
        <div className={styles.chartLegend}>
          {[{ label: "Vistas", color: "#818cf8" }, { label: "Sesiones", color: "#34d399" }].map(l => (
            <span key={l.label} className={styles.legendItem}>
              <span className={styles.legendLine} style={{ background: l.color }} />
              {l.label}
            </span>
          ))}
        </div>
      </div>

      {/* Bottom grid */}
      <div className={styles.bottomGrid}>

        {/* Páginas más visitadas */}
        <div className={styles.box}>
          <h3 className={styles.boxTitle}>Páginas Más Visitadas</h3>
          <div className={styles.pagesList}>
            {topPages.map(p => (
              <div key={p.page} className={styles.pageRow}>
                <p className={styles.pageName}>{p.page}</p>
                <div className={styles.barTrack}>
                  <div
                    className={styles.barFill}
                    style={{ width: `${(p.visits / maxVisits) * 100}%` }}
                  />
                </div>
                <p className={styles.pageCount}>{p.visits}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Dispositivos */}
        <div className={styles.box}>
          <div className={styles.boxTitleRow}>
            <span className={styles.boxTitleIcon}><FiMonitor size={14} /></span>
            <h3 className={styles.boxTitle}>Dispositivos</h3>
          </div>
          <div className={styles.devicesLayout}>
            <ResponsiveContainer width={120} height={120}>
              <PieChart>
                <Pie
                  data={devices}
                  cx="50%" cy="50%"
                  innerRadius={35} outerRadius={55}
                  dataKey="value"
                  strokeWidth={0}
                >
                  {devices.map((d, i) => <Cell key={i} fill={d.color} />)}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <div className={styles.devicesList}>
              {devices.map(d => {
                const total = devices.reduce((a, b) => a + b.value, 0)
                const pct   = ((d.value / total) * 100).toFixed(1)
                return (
                  <div key={d.name} className={styles.deviceRow}>
                    <span className={styles.deviceName}>
                      <span className={styles.deviceDot} style={{ background: d.color }} />
                      {d.name}
                    </span>
                    <span className={styles.deviceCount}>{d.value} ({pct}%)</span>
                  </div>
                )
              })}
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}

import { useEffect, useState, useMemo } from "react"
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, BarChart, Bar, Cell } from "recharts"
import { FiTrendingUp, FiDollarSign, FiUsers, FiCheckCircle, FiShoppingCart } from "react-icons/fi"
import { courseService } from "../../../../../services/courseService"
import styles from "./VentasTab.module.css"

const STAT_CARDS = [
  { key: "totalRevenue",   label: "Ingresos totales",   sub: "Ventas generadas por cursos",        Icon: FiDollarSign,  format: v => `S/ ${v.toFixed(2)}` },
  { key: "totalSales",     label: "Cursos vendidos",    sub: "Número total de inscripciones",      Icon: FiShoppingCart,format: v => v },
  { key: "activeCourses",  label: "Cursos activos",     sub: "Disponibles en el catálogo",         Icon: FiUsers,       format: v => v },
  { key: "completedSales", label: "Ventas completadas", sub: "Pagos confirmados",                  Icon: FiCheckCircle, format: v => v },
]

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null
  return (
    <div className={styles.tooltip}>
      <p className={styles.tooltipLabel}>{label}</p>
      <p className={styles.tooltipValue}>Ingresos: S/ {payload[0].value.toFixed(2)}</p>
    </div>
  )
}

export default function VentasTab() {
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true)
        const data = await courseService.getSalesStats()
        setStats(data)
      } catch (err) {
        console.error("Error cargando estadísticas de ventas:", err)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  const monthlyRevenue = stats?.monthlyRevenue ?? []
  const topCourses = useMemo(() => stats?.topCourses ?? [], [stats])

  if (loading) {
    return <div className={styles.loading}>Cargando métricas de ventas...</div>
  }

  return (
    <div className={styles.wrapper}>
      <div className={styles.statsGrid}>
        {STAT_CARDS.map(({ key, label, sub, Icon, format }) => (
          <div key={key} className={styles.statCard}>
            <div className={styles.statTop}>
              <p className={styles.statLabel}>{label}</p>
              <span className={styles.statIcon}><Icon size={18} /></span>
            </div>
            <p className={styles.statValue}>{format(stats?.[key] ?? 0)}</p>
            <p className={styles.statSub}>{sub}</p>
          </div>
        ))}
      </div>

      <div className={styles.grid}>
        <div className={styles.box}>
          <div className={styles.boxHeader}>
            <div className={styles.boxTitleRow}>
              <span className={styles.boxIcon}><FiTrendingUp size={15} /></span>
              <h3 className={styles.boxTitle}>Ingresos por mes (últimos 6 meses)</h3>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={monthlyRevenue} margin={{ top: 0, right: 0, left: -18, bottom: 0 }}>
              <defs>
                <linearGradient id="revenueArea" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#22c55e" stopOpacity={0.35} />
                  <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="month" tick={{ fill: "rgba(148,163,184,0.9)", fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: "rgba(148,163,184,0.9)", fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Area type="monotone" dataKey="revenue" stroke="#22c55e" strokeWidth={2} fill="url(#revenueArea)" dot={false} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className={styles.box}>
          <div className={styles.boxHeader}>
            <h3 className={styles.boxTitle}>Top cursos por ingresos</h3>
            <p className={styles.boxSub}>Basado en inscripciones e ingresos generados</p>
          </div>

          {topCourses.length === 0 ? (
            <p className={styles.empty}>Aún no hay datos de ventas.</p>
          ) : (
            <div className={styles.topCourses}>
              <ResponsiveContainer width="100%" height={180}>
                <BarChart data={topCourses} layout="vertical" margin={{ left: 70, right: 10, top: 0, bottom: 0 }}>
                  <XAxis type="number" hide />
                  <YAxis
                    type="category"
                    dataKey="title"
                    tick={{ fill: "rgba(148,163,184,0.95)", fontSize: 11 }}
                    width={60}
                  />
                  <Tooltip
                    formatter={value => [`S/ ${value.toFixed(2)}`, "Ingresos"]}
                    labelStyle={{ color: "rgba(226,232,240,0.96)", fontSize: 12 }}
                    contentStyle={{ background: "#020617", borderRadius: 8, border: "1px solid rgba(30,64,175,0.7)" }}
                  />
                  <Bar dataKey="revenue" radius={[4, 4, 4, 4]}>
                    {topCourses.map((c, i) => (
                      <Cell key={c.id} fill={i === 0 ? "#22c55e" : "#4ade80"} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>

              <div className={styles.list}>
                {topCourses.map(c => (
                  <div key={c.id} className={styles.courseRow}>
                    <div>
                      <p className={styles.courseName}>{c.title}</p>
                      <p className={styles.courseMeta}>{c.enrollmentsCount} inscripciones</p>
                    </div>
                    <p className={styles.courseRevenue}>S/ {c.revenue.toFixed(2)}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}


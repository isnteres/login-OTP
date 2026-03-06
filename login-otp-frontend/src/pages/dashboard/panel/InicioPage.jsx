import React from "react";
import { useInicio } from "./hooks/useInicio";
import { 
  FiUsers, FiBookOpen, FiDollarSign, FiPercent, 
  FiTrendingUp, FiPieChart, FiShoppingBag 
} from "react-icons/fi";
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, 
  ResponsiveContainer, PieChart, Pie, Cell, Legend 
} from "recharts";

export default function InicioPage() {
  const { data, loading, error } = useInicio();

  if (loading) return <div style={{ padding: '40px', color: 'white' }}>⏳ Sincronizando datos ejecutivos...</div>;
  if (error) return <div style={{ padding: '40px', color: '#f87171' }}>❌ Error: {error}</div>;

  const stats = data || {};

  // Colores para el gráfico de pastel
  const COLORS = ['#6366f1', '#10b981', '#f59e0b', '#ec4899', '#8b5cf6'];

  return (
    <div style={{ padding: '32px', fontFamily: "'DM Sans', sans-serif", color: 'white' }}>
      <header style={{ marginBottom: '32px' }}>
        <h1 style={{ fontSize: '28px', fontWeight: 'bold', margin: 0 }}>Panel Ejecutivo</h1>
        <p style={{ color: 'rgba(255,255,255,0.5)' }}>Resumen de rendimiento Maquimpower</p>
      </header>

      {/* 1. CUATRO CARDS REQUERIDAS */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginBottom: '32px' }}>
        <StatCard title="Ingresos Totales" value={`$${stats.totalRevenue || 0}`} icon={<FiDollarSign />} color="#f59e0b" />
        <StatCard title="Clientes Activos" value={stats.activeClients || 0} icon={<FiUsers />} color="#6366f1" />
        <StatCard title="Tasa Conversión" value={`${stats.conversionRate || 0}%`} icon={<FiPercent />} color="#ec4899" />
        <StatCard title="Estudiantes Activos" value={stats.activeStudents || 0} icon={<FiBookOpen />} color="#10b981" />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '24px' }}>
        
        {/* 2. AREA CHART - INGRESOS MENSUALES */}
        <div style={cardStyle}>
          <h3 style={cardTitleStyle}><FiTrendingUp color="#6366f1" /> Ingresos Mensuales</h3>
          <div style={{ width: '100%', height: 250 }}>
            <ResponsiveContainer>
              <AreaChart data={stats.monthlyRevenue || []}>
                <defs>
                  <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{fill: 'gray', fontSize: 12}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: 'gray', fontSize: 12}} />
                <Tooltip contentStyle={{ background: '#111827', border: 'none', borderRadius: '8px' }} />
                <Area type="monotone" dataKey="revenue" stroke="#6366f1" fillOpacity={1} fill="url(#colorRev)" strokeWidth={3} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* 3. PIE CHART - FUENTES DE LEADS */}
        <div style={cardStyle}>
          <h3 style={cardTitleStyle}><FiPieChart color="#10b981" /> Fuentes de Leads</h3>
          <div style={{ width: '100%', height: 250 }}>
            <ResponsiveContainer>
              <PieChart>
                <Pie
                  data={stats.leadSources || []}
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {(stats.leadSources || []).map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend iconType="circle" />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* 4. TABLA - TOP 5 PRODUCTOS MÁS VENDIDOS */}
      <div style={cardStyle}>
        <h3 style={cardTitleStyle}><FiShoppingBag color="#f59e0b" /> Productos más vendidos (Top 5)</h3>
        <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '10px' }}>
          <thead>
            <tr style={{ textAlign: 'left', color: 'rgba(255,255,255,0.4)', fontSize: '13px' }}>
              <th style={{ padding: '12px' }}>Curso</th>
              <th style={{ padding: '12px' }}>Inscripciones</th>
              <th style={{ padding: '12px' }}>Ingresos</th>
            </tr>
          </thead>
          <tbody>
            {(stats.topCourses || []).map((curso, i) => (
              <tr key={i} style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                <td style={{ padding: '12px', fontWeight: '500' }}>{curso.name}</td>
                <td style={{ padding: '12px' }}>{curso.enrollments}</td>
                <td style={{ padding: '12px', color: '#10b981' }}>${curso.revenue}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// Estilos rápidos para evitar archivos externos si no los quieres
const cardStyle = {
  background: 'rgba(255,255,255,0.03)',
  border: '1px solid rgba(255,255,255,0.08)',
  padding: '24px',
  borderRadius: '20px'
};

const cardTitleStyle = {
  margin: '0 0 20px 0',
  fontSize: '16px',
  display: 'flex',
  alignItems: 'center',
  gap: '10px',
  fontWeight: '600'
};

function StatCard({ title, value, icon, color }) {
  return (
    <div style={cardStyle}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
        <div style={{ color: color, display: 'flex' }}>{React.cloneElement(icon, { size: 18 })}</div>
        <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: '13px' }}>{title}</span>
      </div>
      <div style={{ fontSize: '24px', fontWeight: 'bold' }}>{value}</div>
    </div>
  );
}
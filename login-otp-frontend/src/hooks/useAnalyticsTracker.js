import { useEffect, useRef } from 'react'
import { useLocation } from 'react-router-dom'

// sessionId de la pestaña actual — en memoria, se regenera si cierran la pestaña
const SESSION_ID = Math.random().toString(36).slice(2, 18)

// Mapa de rutas a nombres legibles para el dashboard de analítica
const PAGE_NAMES = {
  '/':                          'Welcome',
  '/login':                     'Login — Credenciales',
  '/login/otp':                 'Login — Verificación OTP',
  '/dashboard':                 'Dashboard',
  '/dashboard/rrhh/personal':   'RRHH — Personal',
  '/dashboard/rrhh/desempeno':  'RRHH — Desempeño',
  '/dashboard/rrhh/objetivos':  'RRHH — Objetivos',
  '/dashboard/rrhh/auditoria':  'RRHH — Auditoría',
  '/dashboard/analitica':       'Analítica Web',
  '/dashboard/auditoria':       'Auditoría del Sistema',
  '/dashboard/soporte':         'Soporte',
  '/dashboard/comunidad':       'Comunidad',
}

const API_URL = 'http://localhost:8000/api'

export function useAnalyticsTracker(userId = null) {
  const location  = useLocation()
  const lastPath  = useRef(null)

  useEffect(() => {
    const path = location.pathname

    // Evitar doble registro si la ruta no cambió
    if (path === lastPath.current) return
    lastPath.current = path

    const pageName = PAGE_NAMES[path] ?? path

    fetch(`${API_URL}/analytics/track`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({
        page:      pageName,
        sessionId: SESSION_ID,
        userId:    userId ?? null,
      }),
    }).catch(() => {
    })
  }, [location.pathname, userId])
}
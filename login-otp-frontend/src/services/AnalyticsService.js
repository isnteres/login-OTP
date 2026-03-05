const API_URL = 'http://localhost:8000/api'

const request = async (method, endpoint, body) => {
  const response = await fetch(`${API_URL}${endpoint}`, {
    method,
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    body: body ? JSON.stringify(body) : undefined,
  })
  const data = await response.json()
  if (!response.ok) throw new Error(data.message || 'Error en la solicitud')
  return data
}

export const analyticsService = {
  // Obtiene todos los datos de analítica para el dashboard
  getAll: (period = '7d') => request('GET', `/analytics?period=${period}`),

  // Registra una visita de página
  track: (page, sessionId, userId = null) =>
    request('POST', '/analytics/track', { page, sessionId, userId }),
}

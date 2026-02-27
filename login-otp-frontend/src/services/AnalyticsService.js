const API_URL = "http://localhost:8000/api"

const request = async (method, endpoint) => {
  const response = await fetch(`${API_URL}${endpoint}`, {
    method,
    headers: { "Content-Type": "application/json", Accept: "application/json" },
  })
  const data = await response.json()
  if (!response.ok) throw new Error(data.message || "Error en la solicitud")
  return data
}

export const analyticsService = {
  getAll: (period = "7d") => request("GET", `/analytics?period=${period}`),
}

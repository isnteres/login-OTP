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

export const auditService = {
  getSummary: ()              => request("GET", "/audit/summary"),
  getLogs:    (page = 1)      => request("GET", `/audit/logs?page=${page}&per_page=20`),
}
const API_URL = "http://localhost:8000/api"

const request = async (method, endpoint, body) => {
  const response = await fetch(`${API_URL}${endpoint}`, {
    method,
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: body ? JSON.stringify(body) : undefined,
  })

  const data = await response.json()
  if (!response.ok) throw new Error(data.message || "Error en la solicitud")
  return data
}

export const courseService = {
  getAll: (params = {}) => {
    const query = new URLSearchParams()
    if (params.category) query.set("category", params.category)
    if (params.level)    query.set("level", params.level)
    if (params.all)      query.set("all", "1")

    const qs = query.toString()
    return request("GET", `/courses${qs ? `?${qs}` : ""}`)
  },

  getById: (id) => request("GET", `/courses/${id}`),

  create: (data) => request("POST", "/courses", data),

  update: (id, data) => request("PUT", `/courses/${id}`, data),

  toggleActive: (id) => request("PATCH", `/courses/${id}/toggle`),

  getSalesStats: () => request("GET", "/courses/stats/sales"),
}


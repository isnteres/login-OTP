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

export const enrollmentService = {
  getAll:      ()         => request("GET",    "/enrollments"),
  getById:     (id)       => request("GET",    `/enrollments/${id}`),
  create:      (data)     => request("POST",   "/enrollments", data),
  update:      (id, data) => request("PUT",    `/enrollments/${id}`, data),
}


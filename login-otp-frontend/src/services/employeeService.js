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

export const employeeService = {
  getAll:      ()         => request("GET",    "/employees"),
  getStats:    ()         => request("GET",    "/employees/stats"),
  getById:     (id)       => request("GET",    `/employees/${id}`),
  create:      (data)     => request("POST",   "/employees", data),
  update:      (id, data) => request("PUT",    `/employees/${id}`, data),
  toggleBlock: (id)       => request("PATCH",  `/employees/${id}/block`),
  remove:      (id)       => request("DELETE", `/employees/${id}`),
}
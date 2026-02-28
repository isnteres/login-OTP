const API_URL = "http://localhost:8000/api";
const getToken = () => localStorage.getItem("token");

// ── Helper GET ───────────────────────────────────────────────
const get = async (endpoint, params = {}) => {
  const token = getToken();

  // Convierte los params a query string  ?search=...&type=...
  const query = new URLSearchParams(
    Object.fromEntries(Object.entries(params).filter(([, v]) => v)),
  ).toString();

  const url = query
    ? `${API_URL}${endpoint}?${query}`
    : `${API_URL}${endpoint}`;

  const response = await fetch(url, {
    method: "GET",
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await response.json();
  if (!response.ok) throw new Error(data.message || "Error en la solicitud");
  return data;
};

// ── Helper POST ──────────────────────────────────────────────
const post = async (endpoint, body) => {
  const token = getToken();

  const response = await fetch(`${API_URL}${endpoint}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(body),
  });

  const data = await response.json();
  if (!response.ok) throw new Error(data.message || "Error en la solicitud");
  return data;
};

// ── Helper PUT ───────────────────────────────────────────────
const put = async (endpoint, body) => {
  const token = getToken();

  const response = await fetch(`${API_URL}${endpoint}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(body),
  });

  const data = await response.json();
  if (!response.ok) throw new Error(data.message || "Error en la solicitud");
  return data;
};

// ── Helper PATCH ─────────────────────────────────────────────
const patch = async (endpoint, body) => {
  const token = getToken();

  const response = await fetch(`${API_URL}${endpoint}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(body),
  });

  const data = await response.json();
  if (!response.ok) throw new Error(data.message || "Error en la solicitud");
  return data;
};

// ── Helper DELETE ────────────────────────────────────────────
const del = async (endpoint) => {
  const token = getToken();

  const response = await fetch(`${API_URL}${endpoint}`, {
    method: "DELETE",
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await response.json();
  if (!response.ok) throw new Error(data.message || "Error en la solicitud");
  return data;
};

// ── Employee Service ─────────────────────────────────────────
export const employeeService = {
  // GET /api/employees — con filtros opcionales
  // search, type, status coinciden con los filtros de PersonalFilters
  getAll: (filters = {}) =>
    get("/employees", {
      search: filters.search || "",
      type: filters.type !== "todos" ? filters.type : "",
      status: filters.status !== "todos" ? filters.status : "",
      page: filters.page || 1,
    }),

  // GET /api/employees/{id}
  getById: (id) => get(`/employees/${id}`),

  // POST /api/employees — datos del AddEmployeeModal
  create: (formData) => post("/employees", formData),

  // PUT /api/employees/{id}
  update: (id, formData) => put(`/employees/${id}`, formData),

  // PATCH /api/employees/{id}/status
  changeStatus: (id, status) => patch(`/employees/${id}/status`, { status }),

  // DELETE /api/employees/{id}
  remove: (id) => del(`/employees/${id}`),
};

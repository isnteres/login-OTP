const API_URL = "http://localhost:8000/api";
const getToken = () => localStorage.getItem("token");

const get = async (endpoint, params = {}) => {
  const token = getToken();

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

export const auditService = {
  // GET /api/audit/rrhh
  getRrhhLogs: (filters = {}) =>
    get("/audit/rrhh", {
      search: filters.search || "",
      page: filters.page || 1,
    }),

  // GET /api/audit/rrhh/stats
  getRrhhStats: () => get("/audit/rrhh/stats"),

  // GET /api/audit/general
  getGeneralLogs: (filters = {}) =>
    get("/audit/general", {
      search: filters.search || "",
      page: filters.page || 1,
    }),
};

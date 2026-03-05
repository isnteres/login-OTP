const API_URL = "http://localhost:8000/api"

<<<<<<< HEAD
export async function request(endpoint, options = {}) {
  const url = `${API_URL}${endpoint}`;
  const token = localStorage.getItem('auth_token');

  console.group(`[API REQUEST] ${endpoint}`);
  console.log('URL:', url);
  console.log('Method:', options.method || 'GET');
  console.log('Token present:', !!token);
  console.groupEnd();

  if (!token) {
    console.warn('[AUTH] No token found. Skipping request to:', url);
    throw new Error('No authentication token');
  }

  const response = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Authorization': `Bearer ${token}`,
      ...options.headers
    },
    body: options.body ? JSON.stringify(options.body) : undefined
  });

  if (response.status === 401) {
    console.error('[AUTH ERROR] 401 Unauthorized detected');
    console.error('URL:', url);
    console.error('Method:', options.method || 'GET');

    localStorage.removeItem('auth_token');
    window.location.href = '/login';

    throw new Error('Session expired');
  }

  const data = await response.json();
  if (!response.ok) throw new Error(data.message || "Error en la solicitud");
  return data;
}

export const employeeService = {
  getAll: () => request("/crm/employees"),
  create: (data) => request("/crm/employees", { method: "POST", body: data }),
  update: (id, data) => request(`/crm/employees/${id}`, { method: "PUT", body: data }),
  remove: (id) => request(`/crm/employees/${id}`, { method: "DELETE" }),
  getDiagnostics: () => request("/crm/hr-diagnostics"),
}
=======
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
>>>>>>> 3924202a24e5cb3bac634045dd8f477585ee1aea

const API_URL = "http://localhost:8000/api"

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
  // Nuevos endpoints de Kenia integrados con tu sistema de Auth
  getAll:      () => request("/employees"),
  getStats:    () => request("/employees/stats"),
  getById:     (id) => request(`/employees/${id}`),
  create:      (data) => request("/employees", { method: "POST", body: data }),
  update:      (id, data) => request(`/employees/${id}`, { method: "PUT", body: data }),
  toggleBlock: (id) => request(`/employees/${id}/block`, { method: "PATCH" }),
  remove:      (id) => request(`/employees/${id}`, { method: "DELETE" }),
  
  // Tu endpoint de diagnósticos conservado
  getDiagnostics: () => request("/crm/hr-diagnostics"),
}
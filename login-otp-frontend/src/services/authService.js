const API_URL = "http://localhost:8000/api"

export async function request(endpoint, options = {}) {
  const url = `${API_URL}${endpoint}`;
  const token = localStorage.getItem('auth_token');

  console.group(`[AUTH API REQUEST] ${endpoint}`);
  console.log('URL:', url);
  console.log('Method:', options.method || 'GET');
  console.log('Token present:', !!token);
  console.groupEnd();

  const response = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
      ...options.headers
    },
    body: options.body ? JSON.stringify(options.body) : undefined
  });

  if (response.status === 401) {
    console.error('[AUTH ERROR] 401 Unauthorized detected');
    localStorage.removeItem('auth_token');
    if (window.location.pathname !== '/login') {
      window.location.href = '/login';
    }
    throw new Error('Session expired');
  }

  const data = await response.json();
  if (!response.ok) throw new Error(data.message || "Error en la solicitud");
  return data;
}

export const authService = {
  loginCredentials: (email, password) => request("/login/credentials", { method: "POST", body: { email, password } }),
  loginVerifyOtp: (email, otp) => request("/login/verify-otp", { method: "POST", body: { email, otp } }),
  changePassword: (email, newPassword) => request("/auth/change-password", { method: "POST", body: { email, newPassword } }),
}
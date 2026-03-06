const API_URL = "http://localhost:8000/api";

/**
 * Función centralizada para peticiones (Self-contained)
 * Maneja el Bearer Token y errores de sesión expirada
 */
async function request(method, endpoint, body = null) {
  const url = `${API_URL}${endpoint}`;
  const token = localStorage.getItem('auth_token');

  const options = {
    method,
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
    }
  };

  if (body) {
    options.body = JSON.stringify(body);
  }

  const response = await fetch(url, options);

  // Manejo de sesión expirada (401 Unauthorized)
  if (response.status === 401) {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user');
    if (window.location.pathname !== '/login') {
      window.location.href = '/login';
    }
    throw new Error('Sesión expirada');
  }

  const data = await response.json();
  if (!response.ok) throw new Error(data.message || "Error en la solicitud");
  return data;
}

/**
 * Servicio de Autenticación Unificado
 */
export const authService = {
  // 1. Paso inicial: Credenciales
  loginCredentials: (email, password) => 
    request("POST", "/login/credentials", { email, password }),

  // 2. Paso final: OTP y persistencia de sesión
  loginVerifyOtp: async (email, otp) => {
    const data = await request("POST", "/login/verify-otp", { email, otp });
    
    // Guardamos token y datos del usuario si la respuesta es exitosa
    if (data && data.user) {
      localStorage.setItem("user", JSON.stringify(data.user));
      if (data.token) {
        localStorage.setItem("auth_token", data.token);
      }
    }
    return data;
  },

  // 3. Gestión de seguridad (Mejora de Dayana)
  changePassword: (email, newPassword) => 
    request("POST", "/auth/change-password", { email, newPassword }),
};
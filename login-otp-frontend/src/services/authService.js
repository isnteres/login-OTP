const API_URL = "http://localhost:8000/api";

// ── Helper POST ──────────────────────────────────────────────
const post = async (endpoint, body, token = null) => {
  const headers = {
    "Content-Type": "application/json",
    Accept: "application/json",
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_URL}${endpoint}`, {
    method: "POST",
    headers,
    body: JSON.stringify(body),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Error en la solicitud");
  }

  return data;
};

// ── Helper GET ───────────────────────────────────────────────
const get = async (endpoint, token = null) => {
  const headers = {
    Accept: "application/json",
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_URL}${endpoint}`, {
    method: "GET",
    headers,
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Error en la solicitud");
  }

  return data;
};

// ── Helpers para el token en localStorage ───────────────────
const getToken = () => localStorage.getItem("token");
const saveToken = (token) => localStorage.setItem("token", token);
const removeToken = () => localStorage.removeItem("token");

export const authService = {
  // =====================
  //      REGISTRO
  // =====================

  registerSendOtp: (email) => post("/auth/register/send-otp", { email }),

  registerVerifyOtp: (email, otp) =>
    post("/auth/register/verify-otp", { email, otp }),

  registerCreatePassword: (email, password) =>
    post("/auth/register/create-password", { email, password }),

  // =====================
  //       LOGIN
  // =====================

  // Paso 1 — credenciales
  loginCredentials: async (email, password) => {
    const data = await post("/auth/login", { email, password });
    // Solo guarda token si ya completó todo el flujo
    // (en este flujo nunca viene token aquí, viene otp_required o change_password)
    if (data.token) {
      saveToken(data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
    }
    return data;
  },

  // Paso 2a — verificar OTP de login
  loginVerifyOtp: async (email, otp) => {
    const data = await post("/auth/login/verify-otp", { email, otp });
    if (data.token) {
      saveToken(data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
    }
    return data;
  },

  // Paso 2b — cambiar contraseña temporal
  loginChangePassword: (email, password) =>
    post("/auth/login/change-password", { email, password }),

  // =====================
  //      SESIÓN
  // =====================

  logout: async () => {
    const token = getToken();
    if (token) {
      await post("/auth/logout", {}, token);
    }
    removeToken();
    localStorage.removeItem("user");
  },

  me: () => get("/auth/me", getToken()),

  getToken,
  getUser: () => {
    const user = localStorage.getItem("user");
    return user ? JSON.parse(user) : null;
  },
  isAuthenticated: () => !!getToken(),
};

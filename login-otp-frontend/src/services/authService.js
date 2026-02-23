const API_URL = "http://localhost:8000/api";

// Helper para no repetir fetch en cada método
const post = async (endpoint, body) => {
  const response = await fetch(`${API_URL}${endpoint}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify(body),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Error en la solicitud");
  }

  return data;
};

export const authService = {
  // =====================
  //       REGISTRO
  // =====================
  registerSendOtp: (email) => post("/register/send-otp", { email }),

  registerVerifyOtp: (email, otp) =>
    post("/register/verify-otp", { email, otp }),

  registerCreatePassword: (email, password) =>
    post("/register/create-password", { email, password }),

  // =====================
  //        LOGIN
  // =====================
  loginCredentials: (email, password) =>
    post("/login/credentials", { email, password }),

  loginVerifyOtp: (email, otp) => post("/login/verify-otp", { email, otp }),
};

const API_URL = "http://localhost:8000/api"

const request = async (method, endpoint, body) => {
  const response = await fetch(`${API_URL}${endpoint}`, {
    method,
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: body ? JSON.stringify(body) : undefined,
  })
  const data = await response.json()
  if (!response.ok) throw new Error(data.message || "Error en la solicitud")
  return data
}

const post = (endpoint, body) => request("POST", endpoint, body)

export const authService = {
  loginCredentials: (email, password) =>
    post("/login/credentials", { email, password }),

  loginVerifyOtp: async (email, otp) => {
    const data = await post("/login/verify-otp", { email, otp });

    localStorage.setItem("user", JSON.stringify(data.user));

    return data;
  },

  changePassword: (email, newPassword) =>
    post("/auth/change-password", { email, newPassword }),
}
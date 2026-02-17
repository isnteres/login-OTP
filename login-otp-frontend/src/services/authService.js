const API_URL = "http://localhost:8000/api";

export const authService = {
  // Enviar OTP
  sendOtp: async (email) => {
    try {
      const response = await fetch(`${API_URL}/send-otp`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Error al enviar OTP");
      }

      return data;
    } catch (error) {
      throw error;
    }
  },

  // Verificar OTP
  verifyOtp: async (email, otp) => {
    try {
      const response = await fetch(`${API_URL}/verify-otp`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({ email, otp }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "OTP inválido");
      }

      return data;
    } catch (error) {
      throw error;
    }
  },

  // Crear contraseña
  createPassword: async (email, password) => {
    try {
      const response = await fetch(`${API_URL}/create-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Error al crear contraseña");
      }

      return data;
    } catch (error) {
      throw error;
    }
  },
};

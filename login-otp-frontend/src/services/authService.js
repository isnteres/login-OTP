// Mantenemos el import de tu helper de peticiones
import { request } from "./apiHelper"; // Asegúrate de que el nombre del import sea el correcto en tu proyecto

// Helper interno para peticiones POST que Dayana implementó
const post = (endpoint, body) => request("POST", endpoint, body);

export const authService = {
  // Envío de credenciales iniciales
  loginCredentials: (email, password) => 
    post("/login/credentials", { email, password }),

  // Verificación de OTP y guardado de sesión
  loginVerifyOtp: async (email, otp) => {
    const data = await post("/login/verify-otp", { email, otp });
    
    // Guardamos los datos del usuario para mantener la sesión iniciada
    if (data && data.user) {
      console.log("Usuario autenticado:", data.user);
      localStorage.setItem("user", JSON.stringify(data.user));
    }
    
    return data;
  },

  // Nueva funcionalidad de Dayana para el perfil
  changePassword: (email, newPassword) => 
    post("/auth/change-password", { email, newPassword }),
};
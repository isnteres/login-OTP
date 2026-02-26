
export const AUDIT_LOGS_MOCK = [
  {
    id: 1,
    email: "carlos@empresa.com",
    action: "login_exitoso",
    status: "success",
    ip_address: "192.168.1.10",
    created_at: "2024-02-24T10:30:00",
  },
  {
    id: 2,
    email: "unknown@test.com",
    action: "login_fallido",
    status: "failed",
    ip_address: "203.0.113.42",
    created_at: "2024-02-24T11:15:00",
  },
  {
    id: 3,
    email: "ana@empresa.com",
    action: "registro_otp_enviado",
    status: "success",
    ip_address: "192.168.1.25",
    created_at: "2024-02-24T12:00:00",
  },
]

export const AUDIT_SUMMARY_MOCK = {
  total_usuarios: 3,
  total_eventos: 12,
  logins_exitosos: 8,
  logins_fallidos: 2,
  otps_fallidos: 1,
  registros_completados: 3,
}

export const DUPLICATE_AUDIT_MOCK = []

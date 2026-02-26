import { useState, useEffect } from "react"
import { RRHH_AUDIT_MOCK } from "../../../../../mock/auditoriaRrhh.mock"

export function useAuditoriaRrhh() {
  const [registros, setRegistros] = useState([])
  const [loading, setLoading]     = useState(true)
  const [search, setSearch]       = useState("")

  useEffect(() => {
    const timer = setTimeout(() => {
      setRegistros(RRHH_AUDIT_MOCK)
      setLoading(false)
    }, 300)
    return () => clearTimeout(timer)
  }, [])

  const filtered = registros.filter(r =>
    r.empleadoDuplicado?.toLowerCase().includes(search.toLowerCase()) ||
    r.correoEmpleado?.toLowerCase().includes(search.toLowerCase()) ||
    r.adminNombre?.toLowerCase().includes(search.toLowerCase()) ||
    r.adminCorreo?.toLowerCase().includes(search.toLowerCase())
  )

  // Admins únicos que han generado intentos
  const adminsUnicos = new Set(registros.map(r => r.adminNombre)).size

  const stats = {
    totalIntentos:      registros.length,
    empleadosAfectados: new Set(registros.map(r => r.empleadoDuplicado)).size,
    adminsInvolucrados: adminsUnicos,
  }

  return { registros: filtered, stats, loading, search, setSearch }
}
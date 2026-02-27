import { useState, useEffect } from "react"
import { auditRrhhService } from "../../../../../services/auditRrhhService"

export function useAuditoriaRrhh() {
  const [registros, setRegistros] = useState([])
  const [loading, setLoading]     = useState(true)
  const [search, setSearch]       = useState("")

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true)
        const data = await auditRrhhService.getDuplicates()
        setRegistros(data)
      } catch (err) {
        console.error("Error cargando auditoría RRHH:", err)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  const filtered = registros.filter(d =>
    d.empleadoDuplicado?.toLowerCase().includes(search.toLowerCase()) ||
    d.correoEmpleado?.toLowerCase().includes(search.toLowerCase()) ||
    d.adminNombre?.toLowerCase().includes(search.toLowerCase())
  )

  const stats = {
    totalIntentos:      registros.length,
    empleadosAfectados: new Set(registros.map(d => d.empleadoDuplicado)).size,
    adminsInvolucrados: new Set(registros.map(d => d.adminNombre)).size,
  }

  return { duplicates: filtered, stats, loading, search, setSearch }
}
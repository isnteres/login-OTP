import { useState, useEffect, useMemo } from "react"
import { employeeService } from "../../../../../services/employeeService"

export function usePersonal() {
  const [employees, setEmployees] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [filterType, setFilterType] = useState("todos")
  const [filterStatus, setFilterStatus] = useState("todos")

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true)
        const data = await employeeService.getAll()
        setEmployees(data)
      } catch (err) {
        if (err.message === 'Session expired') return
        console.error("Error cargando empleados:", err)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  const refetch = async () => {
    try {
      setLoading(true)
      const data = await employeeService.getAll()
      setEmployees(data)
    } catch (err) {
      if (err.message === 'Session expired') return
      console.error("Error recargando empleados:", err)
    } finally {
      setLoading(false)
    }
  }

  const filtered = useMemo(() => employees.filter(e =>
    (e.name.toLowerCase().includes(search.toLowerCase()) ||
      e.email.toLowerCase().includes(search.toLowerCase()) ||
      (e.position || "").toLowerCase().includes(search.toLowerCase())) &&
    (filterType === "todos" || e.type === filterType) &&
    (filterStatus === "todos" || e.status === filterStatus)
  ), [employees, search, filterType, filterStatus])

  const stats = useMemo(() => ({
    total: employees.length,
    instructores: employees.filter(e => e.type === "Instructor").length,
    desarrolladores: employees.filter(e => e.type === "Desarrollador").length,
    administradores: employees.filter(e => e.type === "Administrador").length,
    asistentes: employees.filter(e => e.type === "Asistente Administrativo").length,
  }), [employees])

  return {
    employees: filtered,
    stats,
    loading,
    refetch,
    search, setSearch,
    filterType, setFilterType,
    filterStatus, setFilterStatus,
  }
}
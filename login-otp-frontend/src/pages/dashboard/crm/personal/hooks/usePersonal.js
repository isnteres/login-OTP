import { useState, useEffect, useMemo } from "react";
import { employeeService } from "../../../../../services/employeeService";

export function usePersonal() {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState("todos");
  const [filterStatus, setFilterStatus] = useState("todos");

  // Carga empleados desde el backend
  const fetchEmployees = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await employeeService.getAll({
        search,
        type: filterType,
        status: filterStatus,
      });
      setEmployees(response.data);
    } catch (err) {
      setError(err.message || "Error al cargar empleados");
    } finally {
      setLoading(false);
    }
  };

  // Recarga cuando cambian los filtros
  useEffect(() => {
    fetchEmployees();
  }, [search, filterType, filterStatus]);

  // Agrega empleado llamando al backend
  const addEmployee = async (formData) => {
    try {
      await employeeService.create(formData);
      // Recarga la lista después de crear
      await fetchEmployees();
    } catch (err) {
      throw new Error(err.message || "Error al crear empleado");
    }
  };

  // Cambia el estado de un empleado
  const changeStatus = async (id, status) => {
    try {
      await employeeService.changeStatus(id, status);
      await fetchEmployees();
    } catch (err) {
      throw new Error(err.message || "Error al cambiar estado");
    }
  };

  // Elimina un empleado
  const removeEmployee = async (id) => {
    try {
      await employeeService.remove(id);
      await fetchEmployees();
    } catch (err) {
      throw new Error(err.message || "Error al eliminar empleado");
    }
  };

  // Stats calculadas del array actual
  const stats = useMemo(
    () => ({
      total: employees.length,
      instructores: employees.filter((e) => e.type === "Instructor").length,
      desarrolladores: employees.filter((e) => e.type === "Desarrollador")
        .length,
      administradores: employees.filter((e) => e.type === "Administrador")
        .length,
      asistentes: employees.filter((e) => e.type === "Asistente").length,
    }),
    [employees],
  );

  return {
    employees,
    stats,
    loading,
    error,
    search,
    setSearch,
    filterType,
    setFilterType,
    filterStatus,
    setFilterStatus,
    addEmployee,
    changeStatus,
    removeEmployee,
  };
}

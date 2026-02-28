import { useState, useEffect } from "react";
import { auditService } from "../../../../../services/auditService";

export function useAuditoriaRrhh() {
  const [registros, setRegistros] = useState([]);
  const [stats, setStats] = useState({
    totalIntentos: 0,
    empleadosAfectados: 0,
    adminsInvolucrados: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");

  const fetchLogs = async () => {
    setLoading(true);
    setError("");
    try {
      // Llama a los dos endpoints en paralelo
      const [logsResponse, statsResponse] = await Promise.all([
        auditService.getRrhhLogs({ search }),
        auditService.getRrhhStats(),
      ]);

      // Mapea los campos del backend al formato que espera el frontend
      const mapped = logsResponse.data.data.map((r) => ({
        id: r.id,
        empleadoDuplicado: r.empleado_nombre,
        correoEmpleado: r.correo_empleado,
        adminNombre: r.admin_nombre,
        adminCorreo: r.admin_correo,
        accion: r.accion,
        esDuplicado: r.es_duplicado,
        fechaHora: r.created_at,
      }));

      setRegistros(mapped);
      setStats(statsResponse.data);
    } catch (err) {
      setError(err.message || "Error al cargar auditoría");
    } finally {
      setLoading(false);
    }
  };

  // Recarga cuando cambia el search
  useEffect(() => {
    fetchLogs();
  }, [search]);

  return {
    registros,
    stats,
    loading,
    error,
    search,
    setSearch,
  };
}

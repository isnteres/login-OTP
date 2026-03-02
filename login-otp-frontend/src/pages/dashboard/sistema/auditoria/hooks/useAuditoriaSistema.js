import { useState, useEffect } from "react";
import { auditService } from "../../../../../services/auditService";

export function useAuditoriaSistema() {
  const [logs, setLogs] = useState([]);
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [logsResponse, summaryResponse] = await Promise.all([
        auditService.getGeneralLogs(),
        auditService.getSystemSummary(),
      ]);

      // El map va ANTES del return, dentro del try
      setLogs(
        logsResponse.data.data.map((log) => ({
          ...log,
          email: log.user?.email || "—",
        })),
      );
      setSummary(summaryResponse.data);
    } catch (err) {
      console.error("Error cargando auditoría:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return { logs, summary, loading, refetch: fetchData };
}

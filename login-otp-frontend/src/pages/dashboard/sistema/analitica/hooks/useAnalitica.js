import { useState, useEffect } from "react";
import { auditService } from "../../../../../services/auditService";

export function useAnalitica() {
  const [summary, setSummary] = useState(null);
  const [traffic, setTraffic] = useState([]);
  const [topPages, setTopPages] = useState([]);
  const [devices, setDevices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState("7d");

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await auditService.getAnalytics(period);
        const { summary, traffic, topPages, devices } = response.data;
        setSummary(summary);
        setTraffic(traffic);
        setTopPages(topPages);
        setDevices(devices);
      } catch (err) {
        console.error("Error cargando analítica:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [period]);

  return { summary, traffic, topPages, devices, loading, period, setPeriod };
}

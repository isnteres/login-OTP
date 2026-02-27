import { useState, useEffect } from "react"
import { auditService } from "../../../../../services/auditService"

export function useAuditoriaSistema() {
  const [logs, setLogs]       = useState([])
  const [summary, setSummary] = useState(null)
  const [loading, setLoading] = useState(true)

  const fetchData = async () => {
    try {
      setLoading(true)
      const [summaryData, logsData] = await Promise.all([
        auditService.getSummary(),
        auditService.getLogs(),
      ])
      setSummary(summaryData)
      setLogs(logsData.data)
    } catch (err) {
      console.error("Error cargando auditoría:", err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchData() }, [])

  return { logs, summary, loading, refetch: fetchData }
}
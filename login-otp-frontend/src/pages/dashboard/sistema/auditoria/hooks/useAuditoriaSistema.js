import { useState, useEffect } from "react"
import { AUDIT_LOGS_MOCK, AUDIT_SUMMARY_MOCK } from "../../../../../mock/auditLogs.mock"

export function useAuditoriaSistema() {
  const [logs, setLogs]       = useState([])
  const [summary, setSummary] = useState(null)
  const [loading, setLoading] = useState(true)

  const fetchData = () => {
    setLoading(true)
    setTimeout(() => {
      setSummary(AUDIT_SUMMARY_MOCK)
      setLogs(AUDIT_LOGS_MOCK)
      setLoading(false)
    }, 300)
  }

  useEffect(() => { fetchData() }, [])

  return { logs, summary, loading, refetch: fetchData }
}

import { useState, useEffect } from "react"
import { analyticsService } from "../../../../../services/analyticsService"

export function useAnalitica() {
  const [summary, setSummary]   = useState(null)
  const [traffic, setTraffic]   = useState([])
  const [topPages, setTopPages] = useState([])
  const [devices, setDevices]   = useState([])
  const [loading, setLoading]   = useState(true)
  const [period, setPeriod]     = useState("7d")

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true)
        const data = await analyticsService.getAll(period)
        setSummary(data.summary)
        setTraffic(data.traffic)
        setTopPages(data.topPages)
        setDevices(data.devices)
      } catch (err) {
        console.error("Error cargando analítica:", err)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [period])

  return { summary, traffic, topPages, devices, loading, period, setPeriod }
}
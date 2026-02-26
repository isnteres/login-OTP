import { useState, useEffect } from "react"
import {
  ANALYTICS_SUMMARY_MOCK,
  TRAFFIC_CHART_MOCK,
  TOP_PAGES_MOCK,
  DEVICES_MOCK,
} from "../../../../../mock/analytics.mock"

export function useAnalitica() {
  const [summary, setSummary]   = useState(null)
  const [traffic, setTraffic]   = useState([])
  const [topPages, setTopPages] = useState([])
  const [devices, setDevices]   = useState([])
  const [loading, setLoading]   = useState(true)
  const [period, setPeriod]     = useState("7d")

  useEffect(() => {
    setLoading(true)
    const timer = setTimeout(() => {
      setSummary(ANALYTICS_SUMMARY_MOCK)
      setTraffic(TRAFFIC_CHART_MOCK)
      setTopPages(TOP_PAGES_MOCK)
      setDevices(DEVICES_MOCK)
      setLoading(false)
    }, 400)
    return () => clearTimeout(timer)
  }, [period])

  return { summary, traffic, topPages, devices, loading, period, setPeriod }
}

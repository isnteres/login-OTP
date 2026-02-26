import { useNavigate }    from "react-router-dom"
import DashboardLayout    from "./DashboardLayout"

export default function Dashboard() {
  const navigate = useNavigate()
  return <DashboardLayout onLogout={() => navigate("/")} />
}

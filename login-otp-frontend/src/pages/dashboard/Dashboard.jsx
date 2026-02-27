import { useNavigate, useLocation } from "react-router-dom"
import { useState } from "react"
import DashboardLayout from "./DashboardLayout"
import ChangePasswordModal from "../../components/ui/ChangePasswordModal"

export default function Dashboard() {
  const navigate  = useNavigate()
  const location  = useLocation()

  const mustChange = location.state?.mustChangePassword === true
  const userEmail  = location.state?.userEmail || ""

  const [showChangeModal, setShowChangeModal] = useState(mustChange)

  const handlePasswordChanged = () => {
    setShowChangeModal(false)
    navigate("/dashboard", { replace: true, state: {} })
  }

  return (
    <>
      <DashboardLayout onLogout={() => navigate("/")} />

      {/* Modal bloqueante de cambio de contraseña */}
      {showChangeModal && (
        <ChangePasswordModal
          userEmail={userEmail}
          onSuccess={handlePasswordChanged}
        />
      )}
    </>
  )
}
import { Routes, Route, Navigate } from "react-router-dom"
import Welcome        from "../pages/auth/Welcome"
import LoginFlow      from "../pages/auth/LoginFlow"
import RegisterFlow   from "../pages/auth/RegisterFlow"
import Dashboard      from "../pages/dashboard/Dashboard"
import { useAnalyticsTracker } from '../hooks/useAnalyticsTracker'

export default function AppRouter() {
    useAnalyticsTracker(null)
    return (
        <Routes>
            <Route path="/"          element={<Welcome />}      />
            <Route path="/login"     element={<LoginFlow />}    />
            <Route path="/register"  element={<RegisterFlow />} />
            <Route path="/dashboard" element={<Dashboard />}    />
            {/* Redirigir rutas desconocidas al inicio */}
            <Route path="*"          element={<Navigate to="/" replace />} />
        </Routes>
    )
}

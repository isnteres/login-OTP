import { Routes, Route, Navigate } from "react-router-dom";
import Welcome from "../pages/auth/Welcome";
import LoginFlow from "../pages/auth/LoginFlow";
import RegisterFlow from "../pages/auth/RegisterFlow";
import Dashboard from "../pages/dashboard/Dashboard";
import LandingPage from "../pages/Landing/LandingPage"; // ← nuevo
import { useAnalyticsTracker } from "../hooks/useAnalyticsTracker";

export default function AppRouter() {
  useAnalyticsTracker(null);
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} /> {/* ← cambiado */}
      <Route path="/welcome" element={<Welcome />} />{" "}
      {/* ← Welcome queda en /welcome */}
      <Route path="/login" element={<LoginFlow />} />
      <Route path="/register" element={<RegisterFlow />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

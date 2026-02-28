import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Welcome from "../pages/auth/Welcome";
import LoginFlow from "../pages/auth/LoginFlow";
import RegisterFlow from "../pages/auth/RegisterFlow";
import Dashboard from "../pages/dashboard/Dashboard";
import ProtectedRoute from "./ProtectedRoute";

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Welcome />} />
        <Route path="/login" element={<LoginFlow />} />
        <Route path="/register" element={<RegisterFlow />} />

        {/* Rutas protegidas — redirige a /login si no hay token */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

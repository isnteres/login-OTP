import { useNavigate } from "react-router-dom";
import DashboardLayout from "./DashboardLayout";
import { authService } from "../../services/authService";

export default function Dashboard() {
  const navigate = useNavigate();

  const handleLogout = async () => {
    await authService.logout();
    navigate("/login");
  };

  return <DashboardLayout onLogout={handleLogout} />;
}

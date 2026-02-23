import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Welcome from "./assets/pages/Welcome.jsx";
import RegisterFlow from "./assets/pages/RegisterFlow.jsx";
import LoginFlow from "./assets/pages/LoginFlow.jsx";
import Dashboard from "./assets/pages/Dashboard.jsx";
import Audit from "./assets/pages/Audit.jsx";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Welcome />} />
        <Route path="/register" element={<RegisterFlow />} />
        <Route path="/login" element={<LoginFlow />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/audit" element={<Audit />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

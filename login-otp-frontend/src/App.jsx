import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import AuthFlow from "./assets/pages/AuthFlow.jsx";
import Dashboard from "./assets/pages/Dashboard.jsx";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<AuthFlow />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
import { Routes, Route } from "react-router-dom";
import HRDashboard from "./components/HRDashboard";
import LoginPage from "./components/login/LoginPage";
import HODDashboard from "./components/HODDashboard";
import DGMDashboard from "./components/DGMDashboard";

function App() {
  return (
    <Routes>
      <Route path="/" element={<LoginPage />} />
      <Route path="/dgm" element={<DGMDashboard />} />
      <Route path="/hod" element={<HODDashboard />} />
      <Route path="/hr" element={<HRDashboard />} />
    </Routes>
  );
}

export default App;
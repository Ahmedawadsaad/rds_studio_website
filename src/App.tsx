import { useState, useCallback } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoadingScreen from "./components/LoadingScreen";
import CustomCursor from "./components/CustomCursor";
import PublicSite from "./pages/PublicSite";
import ProjectDetail from "./pages/ProjectDetail";
import Admin from "./pages/Admin";

export default function App() {
  const [loaded, setLoaded] = useState(false);
  const handleDone = useCallback(() => setLoaded(true), []);

  return (
    <BrowserRouter>
      <CustomCursor />
      {!loaded && <LoadingScreen onDone={handleDone} />}
      <Routes>
        <Route path="/" element={<PublicSite />} />
        <Route path="/project/:id" element={<ProjectDetail />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/admin/*" element={<Admin />} />
      </Routes>
    </BrowserRouter>
  );
}

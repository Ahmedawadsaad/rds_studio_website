import { useState, useCallback, useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoadingScreen from "./components/LoadingScreen";
import PublicSite from "./views/PublicSite";
import ProjectDetail from "./views/ProjectDetail";
import Admin from "./views/Admin";

export default function App() {
  const [loaded, setLoaded] = useState(false);
  const handleDone = useCallback(() => setLoaded(true), []);

  useEffect(() => {
    const theme = localStorage.getItem("rds-theme") || "dark";
    document.documentElement.dataset.theme = theme;
  }, []);

  return (
    <BrowserRouter>
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

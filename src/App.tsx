import { useState, useCallback, useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoadingScreen from "./components/LoadingScreen";
import PublicSite from "./views/PublicSite";
import ProjectDetail from "./views/ProjectDetail";
import Admin from "./views/Admin";

// react-router owns navigation. Next tags the landing history entry with __N, which makes
// Next's router hijack the browser Back button when returning to it; clear the tag.
if (typeof window !== "undefined" && (window.history.state as { __N?: boolean } | null)?.__N) {
  window.history.replaceState({ ...window.history.state, __N: false }, "");
}

export default function App() {
  const [loaded, setLoaded] = useState(false);
  const handleDone = useCallback(() => setLoaded(true), []);

  useEffect(() => {
    const theme = localStorage.getItem("rds-theme") || "dark";
    document.documentElement.dataset.theme = theme;
    // ProjectsGrid restores the scroll position itself; the browser's own restore fights it.
    if ("scrollRestoration" in window.history) window.history.scrollRestoration = "manual";
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

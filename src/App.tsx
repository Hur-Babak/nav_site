import { useEffect } from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import type { ReactNode } from "react";
import { SiteNav } from "./components/SiteNav";
import { Footer } from "./components/Recruitment";
import { AuthProvider } from "./components/AuthContext";
import HomePage from "./pages/HomePage";
import MapPage from "./pages/MapPage";
import GalleryPage from "./pages/GalleryPage";

function PageFade({ children }: { children: ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.28, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  );
}

function AnimatedRoutes() {
  const location = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<PageFade><HomePage /></PageFade>} />
        <Route path="/map" element={<PageFade><MapPage /></PageFade>} />
        <Route path="/gallery" element={<PageFade><GalleryPage /></PageFade>} />
      </Routes>
    </AnimatePresence>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <SiteNav />
        <main className="flex-1">
          <AnimatedRoutes />
        </main>
        <Footer />
      </BrowserRouter>
    </AuthProvider>
  );
}

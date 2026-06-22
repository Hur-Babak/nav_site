import { BrowserRouter, Routes, Route } from "react-router-dom";
import { SiteNav } from "./components/SiteNav";
import { Footer } from "./components/Recruitment";
import HomePage from "./pages/HomePage";
import MapPage from "./pages/MapPage";
import GalleryPage from "./pages/GalleryPage";

export default function App() {
  return (
    <BrowserRouter>
      <SiteNav />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/map" element={<MapPage />} />
          <Route path="/gallery" element={<GalleryPage />} />
        </Routes>
      </main>
      <Footer />
    </BrowserRouter>
  );
}

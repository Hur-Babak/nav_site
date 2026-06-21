import { SiteNav } from "./components/SiteNav";
import { Hero } from "./components/Hero";
import { Units, SectionHead } from "./components/Units";
import { Structure } from "./components/Structure";
import { Recruitment, Footer } from "./components/Recruitment";
import { MapSection } from "./components/map/MapSection";

export default function App() {
  return (
    <>
      <SiteNav />
      <main>
        <Hero />
        <Units />
        <section
          id="map"
          className="border-y border-[var(--border)] bg-[var(--bg-soft)]"
        >
          <div className="mx-auto max-w-6xl px-5 py-24">
            <SectionHead
              kicker="Театр дій"
              title="Карта конфлікту"
              desc="Кожна мітка — подія в прибережному секторі. Колір позначає тип, клік відкриває картку: що сталося, хто діяв, фото або відео."
            />
            <div className="mt-12">
              <MapSection />
            </div>
          </div>
        </section>
        <Structure />
        <Recruitment />
      </main>
      <Footer />
    </>
  );
}

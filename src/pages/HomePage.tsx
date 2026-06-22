import { Link } from "react-router-dom";
import { Reveal } from "../components/Reveal";
import { Hero } from "../components/Hero";
import { About } from "../components/About";
import { Units } from "../components/Units";
import { Faq } from "../components/Faq";
import { Recruitment } from "../components/Recruitment";

export default function HomePage() {
  return (
    <>
      <Hero />
      <About />
      <Units />
      <MapTeaser />
      <Faq />
      <Recruitment />
    </>
  );
}

function MapTeaser() {
  return (
    <section className="border-y border-[var(--border)]">
      <Reveal className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-6 px-4 py-16 sm:px-5 md:flex-row md:items-center">
        <div>
          <p className="label-mono text-[var(--accent)]">// Театр дій</p>
          <h2 className="font-display mt-2 text-3xl font-bold uppercase tracking-tight md:text-4xl">
            Інтерактивна карта операцій
          </h2>
          <p className="mt-3 max-w-xl text-[var(--muted)]">
            Реальні карти Arma 3 з atlas. Обирай компанію, дивись події — кожна
            мітка з деталями.
          </p>
        </div>
        <Link
          to="/map"
          className="shrink-0 bg-[var(--accent)] px-6 py-3 font-display text-sm font-semibold uppercase tracking-wider text-black transition-all hover:opacity-90 active:scale-95"
        >
          Відкрити карту
        </Link>
      </Reveal>
    </section>
  );
}

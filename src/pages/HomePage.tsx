import { Link } from "react-router-dom";
import { Hero } from "../components/Hero";
import { Units } from "../components/Units";
import { Structure } from "../components/Structure";
import { Recruitment } from "../components/Recruitment";

export default function HomePage() {
  return (
    <>
      <Hero />
      <Units />
      <MapTeaser />
      <Structure />
      <Recruitment />
    </>
  );
}

function MapTeaser() {
  return (
    <section className="border-y border-[var(--border)] bg-[var(--bg-soft)]">
      <div className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-6 px-5 py-16 md:flex-row md:items-center">
        <div>
          <p className="label-mono text-[var(--accent)]">// Театр дій</p>
          <h2 className="font-display mt-2 text-3xl font-bold uppercase tracking-tight md:text-4xl">
            Інтерактивна карта операцій
          </h2>
          <p className="mt-3 max-w-xl text-[var(--muted)]">
            Реальні карти Arma 3 з atlas. Обирай компанію, дивись події —
            ліквідації, трофеї, удари противника — кожна мітка з деталями.
          </p>
        </div>
        <Link
          to="/map"
          className="font-display shrink-0 bg-[var(--accent)] px-6 py-3 text-sm font-semibold uppercase tracking-wider text-black transition-opacity hover:opacity-90"
        >
          Відкрити карту
        </Link>
      </div>
    </section>
  );
}

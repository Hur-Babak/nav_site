import { CorpsEmblem } from "./Emblems";

export function Hero() {
  return (
    <section id="top" className="relative grain overflow-hidden border-b border-[var(--border)]">
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: "url(/media/20251014191838_1.jpg)" }}
        aria-hidden
      />
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(180deg, rgba(10,13,10,0.55) 0%, rgba(10,13,10,0.78) 55%, rgba(10,13,10,0.97) 100%)",
        }}
        aria-hidden
      />
      <div className="relative mx-auto flex max-w-6xl flex-col items-start gap-6 px-5 py-28 md:py-40">
        <div className="flex items-center gap-4">
          <CorpsEmblem size={64} />
          <div>
            <p className="label-mono">Task Force · UKSF · Classified</p>
            <p className="font-mono text-xs text-[var(--muted-2)]">
              Прибережний сектор · 20.08 — 03.09.2026
            </p>
          </div>
        </div>
        <h1 className="font-display max-w-3xl text-5xl font-bold uppercase leading-[1.02] tracking-tight md:text-7xl">
          Корпус <span className="text-[var(--accent)]">«НАВ»</span>
          <br />
          оперативне командування
        </h1>
        <p className="max-w-xl text-lg leading-relaxed text-[var(--muted)]">
          Спеціальні операції без декларованої належності. Три підрозділи, одна
          мета — зупинити НАПА на узбережжі. Нижче — карта конфлікту, хроніка
          операцій і шлях до лав.
        </p>
        <div className="flex flex-wrap gap-3">
          <a
            href="#map"
            className="font-display text-sm font-semibold uppercase tracking-wider bg-[var(--accent)] px-6 py-3 text-black transition-opacity hover:opacity-90"
          >
            Відкрити карту
          </a>
          <a
            href="#join"
            className="font-display text-sm font-semibold uppercase tracking-wider border border-[var(--border)] px-6 py-3 text-[var(--text)] transition-colors hover:border-[var(--accent)]"
          >
            Приєднатися до ION
          </a>
        </div>
        <div className="mt-6 flex flex-wrap gap-8 border-t border-[var(--border-soft)] pt-6">
          {[
            ["19", "ролей у складі"],
            ["3", "бойові підрозділи"],
            ["8", "операцій на карті"],
          ].map(([n, l]) => (
            <div key={l}>
              <div className="font-display text-3xl font-bold text-[var(--text)]">{n}</div>
              <div className="label-mono">{l}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

import { UNITS } from "../lib/data";
import { UnitCrest } from "./Emblems";
import { Reveal } from "./Reveal";

export function Units() {
  return (
    <section id="units" className="mx-auto max-w-6xl px-4 py-20 sm:px-5 sm:py-24">
      <Reveal>
        <SectionHead kicker="Склад корпусу" title="Підрозділи" />
      </Reveal>
      <div className="mt-12 grid gap-5 md:grid-cols-3">
        {UNITS.map((u, i) => (
          <Reveal key={u.id} delay={i * 0.1}>
            <article
              className="lift group flex h-full flex-col border border-[var(--border)] bg-[var(--panel)] p-7 hover:border-[var(--accent)] hover:shadow-[0_8px_30px_rgba(0,0,0,0.35)]"
              style={{ borderTop: `3px solid ${u.accent}` }}
            >
              <div className="flex items-start justify-between">
                <UnitCrest short={u.short} accent={u.accent} logo={`/logos/${u.id}.png`} />
                <span className="label-mono border border-[var(--accent-2)] px-2 py-1 text-[var(--accent-2)]">
                  Набір відкрито
                </span>
              </div>
              <h3 className="font-display mt-5 text-2xl font-semibold uppercase tracking-wide">
                {u.short}
              </h3>
              <p className="label-mono mt-1">{u.name}</p>
              <p className="mt-4 flex-1 whitespace-pre-line text-sm leading-relaxed text-[var(--muted)]">
                {u.description}
              </p>
              <div className="mt-6 border-t border-[var(--border-soft)] pt-4">
                <span className="font-mono text-xs italic" style={{ color: u.accent }}>
                  «{u.motto}»
                </span>
              </div>
            </article>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

export function SectionHead({
  kicker,
  title,
  desc,
}: {
  kicker: string;
  title: string;
  desc?: string;
}) {
  return (
    <div className="max-w-2xl">
      <p className="label-mono text-[var(--accent)]">// {kicker}</p>
      <h2 className="font-display mt-3 text-3xl font-bold uppercase tracking-tight sm:text-4xl md:text-5xl">
        {title}
      </h2>
      {desc && <p className="mt-4 text-[var(--muted)]">{desc}</p>}
    </div>
  );
}

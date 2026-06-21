import { UNITS } from "../lib/data";
import { UnitCrest } from "./Emblems";

export function Units() {
  return (
    <section id="units" className="mx-auto max-w-6xl px-5 py-24">
      <SectionHead kicker="Склад корпусу" title="Підрозділи" />
      <div className="mt-12 grid gap-5 md:grid-cols-3">
        {UNITS.map((u) => (
          <article
            key={u.id}
            className="group relative flex flex-col border border-[var(--border)] bg-[var(--panel)] p-7 transition-colors hover:border-[var(--muted-2)]"
            style={{ borderTop: `3px solid ${u.accent}` }}
          >
            <div className="flex items-start justify-between">
              <UnitCrest short={u.short} accent={u.accent} />
              {u.open ? (
                <span className="label-mono border border-[var(--accent-2)] px-2 py-1 text-[var(--accent-2)]">
                  Набір відкрито
                </span>
              ) : (
                <span className="label-mono text-[var(--muted-2)]">Закрито</span>
              )}
            </div>
            <h3 className="font-display mt-5 text-2xl font-semibold uppercase tracking-wide">
              {u.short}
            </h3>
            <p className="label-mono mt-1">{u.name}</p>
            <p className="mt-4 flex-1 text-sm leading-relaxed text-[var(--muted)]">
              {u.description}
            </p>
            <div className="mt-6 flex items-center justify-between border-t border-[var(--border-soft)] pt-4">
              <span
                className="font-mono text-xs italic"
                style={{ color: u.accent }}
              >
                «{u.motto}»
              </span>
              <span className="font-display text-xl font-bold">
                {u.members}
                <span className="label-mono ml-1">бійців</span>
              </span>
            </div>
          </article>
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
      <h2 className="font-display mt-3 text-4xl font-bold uppercase tracking-tight md:text-5xl">
        {title}
      </h2>
      {desc && <p className="mt-4 text-[var(--muted)]">{desc}</p>}
    </div>
  );
}

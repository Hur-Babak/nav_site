import { STRUCTURE } from "../lib/data";
import { SectionHead } from "./Units";

export function Structure() {
  return (
    <section
      id="structure"
      className="border-y border-[var(--border)] bg-[var(--bg-soft)]"
    >
      <div className="mx-auto max-w-6xl px-5 py-24">
        <SectionHead
          kicker="Ієрархія"
          title="Структура корпусу"
          desc="19 ролей у складі: від командування Overlord до штатних взводів і груп підтримки."
        />
        <div className="mt-12 space-y-4">
          {STRUCTURE.map((row, i) => (
            <div
              key={row.tier}
              className="grid items-center gap-4 md:grid-cols-[200px_1fr]"
            >
              <div className="label-mono flex items-center gap-3">
                <span className="text-[var(--accent)]">
                  {String(i + 1).padStart(2, "0")}
                </span>
                {row.tier}
              </div>
              <div className="flex flex-wrap gap-2">
                {row.nodes.map((n) => (
                  <span
                    key={n.label}
                    className="border border-[var(--border)] bg-[var(--panel)] px-4 py-2 font-display text-sm font-medium uppercase tracking-wide"
                  >
                    {n.label}
                    {n.note && (
                      <span className="ml-2 font-mono text-xs text-[var(--muted-2)]">
                        {n.note}
                      </span>
                    )}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

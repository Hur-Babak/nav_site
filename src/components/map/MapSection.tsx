import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import ConflictMap from "./ConflictMap";
import {
  EVENTS,
  EVENT_TYPES,
  type EventType,
  type MapEvent,
} from "../../lib/data";

const ALL_TYPES = Object.keys(EVENT_TYPES) as EventType[];

export function MapSection() {
  const [active, setActive] = useState<Set<EventType>>(new Set(ALL_TYPES));
  const [selected, setSelected] = useState<MapEvent | null>(null);

  const counts = useMemo(() => {
    const c: Record<string, number> = {};
    for (const e of EVENTS) c[e.type] = (c[e.type] ?? 0) + 1;
    return c;
  }, []);

  const visible = useMemo(
    () => EVENTS.filter((e) => active.has(e.type)),
    [active]
  );

  function toggle(t: EventType) {
    setActive((prev) => {
      const next = new Set(prev);
      if (next.has(t)) next.delete(t);
      else next.add(t);
      return next;
    });
  }

  return (
    <div className="grid gap-5 lg:grid-cols-[1fr_270px]">
      <div className="relative h-[420px] overflow-hidden border border-[var(--border)] md:h-[560px]">
        <ConflictMap events={visible} onSelect={setSelected} />

        <AnimatePresence>
          {selected && (
            <motion.div
              className="absolute inset-0 z-[1200] flex items-center justify-center bg-black/55 p-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelected(null)}
            >
              <motion.div
                className="w-full max-w-md overflow-hidden border border-[var(--border)] bg-[var(--panel)]"
                initial={{ scale: 0.94, y: 12 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.96, opacity: 0 }}
                transition={{ type: "spring", stiffness: 320, damping: 26 }}
                onClick={(ev) => ev.stopPropagation()}
              >
                {selected.image && (
                  <img
                    src={selected.image}
                    alt=""
                    className="h-44 w-full object-cover"
                  />
                )}
                <div className="p-5">
                  <div className="flex items-center justify-between">
                    <span
                      className="label-mono px-2 py-1"
                      style={{
                        color: EVENT_TYPES[selected.type].color,
                        border: `1px solid ${EVENT_TYPES[selected.type].color}`,
                      }}
                    >
                      {EVENT_TYPES[selected.type].label}
                    </span>
                    <button
                      onClick={() => setSelected(null)}
                      className="label-mono hover:text-[var(--text)]"
                      aria-label="Закрити"
                    >
                      ✕
                    </button>
                  </div>
                  <div className="mt-3 flex items-center gap-4 font-mono text-xs text-[var(--muted-2)]">
                    <span>{selected.date}</span>
                    <span>сектор {selected.sector}</span>
                  </div>
                  <h3 className="font-display mt-2 text-xl font-semibold uppercase tracking-wide">
                    {selected.title}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-[var(--muted)]">
                    {selected.description}
                  </p>
                  {selected.video && (
                    <video
                      src={selected.video}
                      controls
                      className="mt-4 w-full border border-[var(--border)]"
                    />
                  )}
                  <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-[var(--border-soft)] pt-4">
                    {selected.units.map((u) => (
                      <span
                        key={u}
                        className="bg-[var(--panel-2)] px-2 py-1 font-mono text-xs"
                      >
                        {u}
                      </span>
                    ))}
                    <span className="ml-auto font-mono text-[11px] text-[var(--muted-2)]">
                      {selected.source}
                    </span>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <aside className="border border-[var(--border)] bg-[var(--panel)] p-5">
        <p className="label-mono">Легенда · фільтр</p>
        <p className="mt-2 font-mono text-[11px] leading-relaxed text-[var(--muted-2)]">
          Колір мітки = тип події. Натисни, щоб приховати або показати.
        </p>
        <div className="mt-4 space-y-1">
          {ALL_TYPES.map((t) => {
            const on = active.has(t);
            return (
              <button
                key={t}
                onClick={() => toggle(t)}
                className="flex w-full items-center gap-3 py-2 text-left transition-opacity"
                style={{ opacity: on ? 1 : 0.4 }}
              >
                <span
                  className="h-3 w-3 shrink-0 rounded-full"
                  style={{ background: EVENT_TYPES[t].color }}
                />
                <span className="flex-1 text-sm text-[var(--muted)]">
                  {EVENT_TYPES[t].label}
                </span>
                <span className="font-mono text-xs text-[var(--muted-2)]">
                  {counts[t] ?? 0}
                </span>
              </button>
            );
          })}
        </div>
        <div className="mt-5 border-t border-[var(--border-soft)] pt-4 font-mono text-[11px] leading-relaxed text-[var(--muted-2)]">
          Прибережний сектор<br />
          20.08 — 03.09.2026
        </div>
      </aside>
    </div>
  );
}

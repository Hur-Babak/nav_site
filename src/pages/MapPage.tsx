import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import ArmaMap from "../components/map/ArmaMap";
import { POPULAR_MAPS } from "../lib/arma";
import { EVENT_TYPES, type EventType } from "../lib/data";
import {
  loadCompanies,
  saveCompanies,
  resetCompanies,
  exportCompanies,
  uid,
  type Company,
  type MapMarker,
} from "../lib/companies";

const TYPES = Object.keys(EVENT_TYPES) as EventType[];

function readJsonFile(file: File): Promise<Company[]> {
  return new Promise((resolve, reject) => {
    const r = new FileReader();
    r.onload = () => {
      try {
        resolve(JSON.parse(String(r.result)) as Company[]);
      } catch {
        reject(new Error("Некоректний JSON"));
      }
    };
    r.onerror = () => reject(new Error("Помилка читання файлу"));
    r.readAsText(file);
  });
}

export default function MapPage() {
  const [companies, setCompanies] = useState<Company[]>(() => loadCompanies());
  const [selId, setSelId] = useState<string>(() => loadCompanies()[0]?.id ?? "");
  const [editMode, setEditMode] = useState(false);
  const [addType, setAddType] = useState<EventType | null>(null);
  const [selected, setSelected] = useState<MapMarker | null>(null);
  const [newName, setNewName] = useState("");

  const selIdRef = useRef(selId);
  selIdRef.current = selId;

  useEffect(() => {
    saveCompanies(companies);
  }, [companies]);

  const company = companies.find((c) => c.id === selId) ?? companies[0];

  const mutate = (id: string, fn: (c: Company) => Company) =>
    setCompanies((prev) => prev.map((c) => (c.id === id ? fn(c) : c)));

  const addMarker = (x: number, y: number) => {
    if (!company || !addType) return;
    const m: MapMarker = {
      id: uid("m"),
      type: addType,
      title: "Нова подія",
      date: "",
      description: "",
      x: Math.round(x),
      y: Math.round(y),
      units: [],
    };
    mutate(company.id, (c) => ({ ...c, markers: [...c.markers, m] }));
    setSelected(m);
  };

  const updateMarker = (mid: string, patch: Partial<MapMarker>) => {
    mutate(selIdRef.current, (c) => ({
      ...c,
      markers: c.markers.map((m) => (m.id === mid ? { ...m, ...patch } : m)),
    }));
    setSelected((s) => (s && s.id === mid ? { ...s, ...patch } : s));
  };

  const deleteMarker = (mid: string) => {
    mutate(selIdRef.current, (c) => ({
      ...c,
      markers: c.markers.filter((m) => m.id !== mid),
    }));
    setSelected(null);
  };

  const onMarkerMove = useCallback((mid: string, x: number, y: number) => {
    setCompanies((prev) =>
      prev.map((c) =>
        c.id === selIdRef.current
          ? {
              ...c,
              markers: c.markers.map((m) =>
                m.id === mid ? { ...m, x: Math.round(x), y: Math.round(y) } : m
              ),
            }
          : c
      )
    );
  }, []);

  const onMarkerClick = useCallback((m: MapMarker) => setSelected(m), []);

  const addCompany = () => {
    const c: Company = {
      id: uid("co"),
      name: newName.trim() || "Нова компанія",
      color: "#d8772a",
      map: "altis",
      markers: [],
    };
    setCompanies((prev) => [...prev, c]);
    setSelId(c.id);
    setNewName("");
  };

  const deleteCompany = (id: string) => {
    setCompanies((prev) => {
      const next = prev.filter((c) => c.id !== id);
      if (selIdRef.current === id) setSelId(next[0]?.id ?? "");
      return next;
    });
  };

  return (
    <div className="mx-auto max-w-6xl px-5 py-12">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="label-mono text-[var(--accent)]">// Театр дій</p>
          <h1 className="font-display mt-2 text-4xl font-bold uppercase tracking-tight md:text-5xl">
            Карта операцій
          </h1>
        </div>
        <div className="flex overflow-hidden border border-[var(--border)]">
          <button
            onClick={() => {
              setEditMode(false);
              setSelected(null);
            }}
            className="label-mono px-4 py-2"
            style={{
              background: !editMode ? "var(--accent)" : "transparent",
              color: !editMode ? "#000" : "var(--muted)",
            }}
          >
            Перегляд
          </button>
          <button
            onClick={() => {
              setEditMode(true);
              setSelected(null);
            }}
            className="label-mono px-4 py-2"
            style={{
              background: editMode ? "var(--accent)" : "transparent",
              color: editMode ? "#000" : "var(--muted)",
            }}
          >
            Редагування
          </button>
        </div>
      </div>

      {/* Вкладки компаній */}
      <div className="mt-8 flex flex-wrap items-center gap-2">
        {companies.map((c) => (
          <button
            key={c.id}
            onClick={() => {
              setSelId(c.id);
              setSelected(null);
            }}
            className="flex items-center gap-2 border px-4 py-2 font-display text-sm font-medium uppercase tracking-wide"
            style={{
              borderColor: c.id === selId ? c.color : "var(--border)",
              background: c.id === selId ? "var(--panel)" : "transparent",
            }}
          >
            <span className="h-2.5 w-2.5 rounded-full" style={{ background: c.color }} />
            {c.name}
            <span className="font-mono text-xs text-[var(--muted-2)]">
              {c.markers.length}
            </span>
          </button>
        ))}
        {editMode && (
          <div className="flex items-center gap-2">
            <input
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              placeholder="назва компанії"
              className="w-40 border border-[var(--border)] bg-[var(--bg)] px-3 py-2 text-sm"
            />
            <button
              onClick={addCompany}
              className="label-mono border border-[var(--accent-2)] px-3 py-2 text-[var(--accent-2)]"
            >
              + компанія
            </button>
          </div>
        )}
      </div>

      {!company ? (
        <p className="mt-10 text-[var(--muted)]">
          Компаній ще немає. Перейди в «Редагування» і створи першу.
        </p>
      ) : (
        <div className="mt-6 grid gap-5 lg:grid-cols-[1fr_320px]">
          <div className="relative h-[480px] overflow-hidden border border-[var(--border)] md:h-[620px]">
            <ArmaMap
              company={company}
              editMode={editMode}
              addType={addType}
              onAddMarker={addMarker}
              onMarkerClick={onMarkerClick}
              onMarkerMove={onMarkerMove}
            />
          </div>

          {editMode ? (
            <aside className="space-y-6 border border-[var(--border)] bg-[var(--panel)] p-5">
              {/* Налаштування компанії */}
              <section className="space-y-3">
                <p className="label-mono">Компанія</p>
                <Field label="Назва">
                  <input
                    value={company.name}
                    onChange={(e) => mutate(company.id, (c) => ({ ...c, name: e.target.value }))}
                    className="input"
                  />
                </Field>
                <div className="flex gap-3">
                  <Field label="Колір">
                    <input
                      type="color"
                      value={company.color}
                      onChange={(e) => mutate(company.id, (c) => ({ ...c, color: e.target.value }))}
                      className="h-9 w-full bg-[var(--bg)]"
                    />
                  </Field>
                  <Field label="Карта (slug)">
                    <input
                      list="arma-maps"
                      value={company.map}
                      onChange={(e) => mutate(company.id, (c) => ({ ...c, map: e.target.value.trim() }))}
                      className="input"
                    />
                  </Field>
                </div>
                <datalist id="arma-maps">
                  {POPULAR_MAPS.map((m) => (
                    <option key={m.slug} value={m.slug}>
                      {m.name}
                    </option>
                  ))}
                </datalist>
                <button
                  onClick={() => deleteCompany(company.id)}
                  className="label-mono text-[var(--danger)]"
                >
                  Видалити компанію
                </button>
              </section>

              {/* Додавання мітки */}
              <section className="space-y-2 border-t border-[var(--border-soft)] pt-4">
                <p className="label-mono">Нова мітка — обери тип і клікни по карті</p>
                <div className="flex flex-wrap gap-2">
                  {TYPES.map((t) => (
                    <button
                      key={t}
                      onClick={() => setAddType(addType === t ? null : t)}
                      className="flex items-center gap-2 border px-2 py-1 text-xs"
                      style={{
                        borderColor: addType === t ? EVENT_TYPES[t].color : "var(--border)",
                        opacity: addType === t ? 1 : 0.65,
                      }}
                    >
                      <span
                        className="h-3 w-3 rounded-full"
                        style={{ background: EVENT_TYPES[t].color }}
                      />
                      {EVENT_TYPES[t].label}
                    </button>
                  ))}
                </div>
              </section>

              {/* Редактор вибраної мітки */}
              {selected && (
                <section className="space-y-3 border-t border-[var(--border-soft)] pt-4">
                  <p className="label-mono text-[var(--accent)]">Мітка</p>
                  <Field label="Тип">
                    <select
                      value={selected.type}
                      onChange={(e) => updateMarker(selected.id, { type: e.target.value as EventType })}
                      className="input"
                    >
                      {TYPES.map((t) => (
                        <option key={t} value={t}>
                          {EVENT_TYPES[t].label}
                        </option>
                      ))}
                    </select>
                  </Field>
                  <Field label="Заголовок">
                    <input
                      value={selected.title}
                      onChange={(e) => updateMarker(selected.id, { title: e.target.value })}
                      className="input"
                    />
                  </Field>
                  <Field label="Дата">
                    <input
                      value={selected.date}
                      onChange={(e) => updateMarker(selected.id, { date: e.target.value })}
                      placeholder="28.08.2026"
                      className="input"
                    />
                  </Field>
                  <Field label="Опис">
                    <textarea
                      value={selected.description}
                      onChange={(e) => updateMarker(selected.id, { description: e.target.value })}
                      rows={3}
                      className="input"
                    />
                  </Field>
                  <Field label="Фото (URL, напр. /media/crops/squad.jpg)">
                    <input
                      value={selected.image ?? ""}
                      onChange={(e) => updateMarker(selected.id, { image: e.target.value || undefined })}
                      className="input"
                    />
                  </Field>
                  <Field label="Підрозділи (через кому)">
                    <input
                      value={(selected.units ?? []).join(", ")}
                      onChange={(e) =>
                        updateMarker(selected.id, {
                          units: e.target.value.split(",").map((s) => s.trim()).filter(Boolean),
                        })
                      }
                      className="input"
                    />
                  </Field>
                  <p className="font-mono text-[11px] text-[var(--muted-2)]">
                    x {selected.x} · y {selected.y}
                  </p>
                  <button
                    onClick={() => deleteMarker(selected.id)}
                    className="label-mono text-[var(--danger)]"
                  >
                    Видалити мітку
                  </button>
                </section>
              )}

              {/* Дані */}
              <section className="space-y-2 border-t border-[var(--border-soft)] pt-4">
                <p className="label-mono">Дані</p>
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => exportCompanies(companies)}
                    className="label-mono border border-[var(--border)] px-3 py-2 hover:border-[var(--accent)]"
                  >
                    Експорт JSON
                  </button>
                  <label className="label-mono cursor-pointer border border-[var(--border)] px-3 py-2 hover:border-[var(--accent)]">
                    Імпорт JSON
                    <input
                      type="file"
                      accept="application/json"
                      className="hidden"
                      onChange={async (e) => {
                        const f = e.target.files?.[0];
                        if (!f) return;
                        try {
                          const data = await readJsonFile(f);
                          setCompanies(data);
                          setSelId(data[0]?.id ?? "");
                        } catch (err) {
                          alert((err as Error).message);
                        }
                      }}
                    />
                  </label>
                  <button
                    onClick={() => {
                      if (confirm("Скинути до початкових даних?")) {
                        const d = resetCompanies();
                        setCompanies(d);
                        setSelId(d[0]?.id ?? "");
                      }
                    }}
                    className="label-mono border border-[var(--border)] px-3 py-2 text-[var(--muted-2)]"
                  >
                    Скинути
                  </button>
                </div>
                <p className="font-mono text-[11px] leading-relaxed text-[var(--muted-2)]">
                  Зміни зберігаються локально в браузері. Щоб опублікувати —
                  «Експорт JSON» і заміни ним <code>src/data/companies.json</code>,
                  потім commit + push.
                </p>
              </section>
            </aside>
          ) : (
            <aside className="border border-[var(--border)] bg-[var(--panel)] p-5">
              <p className="label-mono">Легенда</p>
              <div className="mt-4 space-y-2">
                {TYPES.map((t) => (
                  <div key={t} className="flex items-center gap-3">
                    <span
                      className="h-3 w-3 rounded-full"
                      style={{ background: EVENT_TYPES[t].color }}
                    />
                    <span className="text-sm text-[var(--muted)]">
                      {EVENT_TYPES[t].label}
                    </span>
                  </div>
                ))}
              </div>
              <p className="mt-5 border-t border-[var(--border-soft)] pt-4 font-mono text-[11px] leading-relaxed text-[var(--muted-2)]">
                Карта: {company.map}. Клікни на мітку — відкриється картка події.
                Редагування міток — у режимі «Редагування».
              </p>
            </aside>
          )}
        </div>
      )}

      {/* Модалка перегляду */}
      {selected && !editMode && (
        <div
          className="fixed inset-0 z-[2000] flex items-center justify-center bg-black/70 p-4"
          onClick={() => setSelected(null)}
        >
          <div
            className="w-full max-w-md overflow-hidden border border-[var(--border)] bg-[var(--panel)]"
            onClick={(e) => e.stopPropagation()}
          >
            {selected.image && (
              <img src={selected.image} alt="" className="h-44 w-full object-cover" />
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
              {selected.date && (
                <div className="mt-3 font-mono text-xs text-[var(--muted-2)]">
                  {selected.date}
                </div>
              )}
              <h3 className="font-display mt-2 text-xl font-semibold uppercase tracking-wide">
                {selected.title}
              </h3>
              {selected.description && (
                <p className="mt-3 text-sm leading-relaxed text-[var(--muted)]">
                  {selected.description}
                </p>
              )}
              {(selected.units?.length || selected.source) && (
                <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-[var(--border-soft)] pt-4">
                  {selected.units?.map((u) => (
                    <span key={u} className="bg-[var(--panel-2)] px-2 py-1 font-mono text-xs">
                      {u}
                    </span>
                  ))}
                  {selected.source && (
                    <span className="ml-auto font-mono text-[11px] text-[var(--muted-2)]">
                      {selected.source}
                    </span>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1 block font-mono text-[11px] text-[var(--muted-2)]">
        {label}
      </span>
      {children}
    </label>
  );
}

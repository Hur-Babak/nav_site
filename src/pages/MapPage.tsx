import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import ArmaMap from "../components/map/ArmaMap";
import { PageBanner } from "../components/PageBanner";
import { useAuth } from "../components/AuthContext";
import { POPULAR_MAPS } from "../lib/arma";
import {
  loadCompanies,
  saveCompanies,
  resetCompanies,
  exportCompanies,
  uid,
  markerImages,
  markerVideos,
  MARKER_COLORS,
  type Company,
  type MapMarker,
} from "../lib/companies";

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

function Swatches({ value, onPick }: { value: string; onPick: (c: string) => void }) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      {MARKER_COLORS.map((c) => (
        <button
          key={c}
          onClick={() => onPick(c)}
          aria-label={c}
          className="h-7 w-7 rounded-full"
          style={{
            background: c,
            outline: value.toLowerCase() === c.toLowerCase() ? "2px solid var(--text)" : "none",
            outlineOffset: "2px",
          }}
        />
      ))}
      <label className="ml-1 flex items-center gap-1 font-mono text-[11px] text-[var(--muted-2)]">
        свій
        <input
          type="color"
          value={value}
          onChange={(e) => onPick(e.target.value)}
          className="h-7 w-8 cursor-pointer bg-transparent"
        />
      </label>
    </div>
  );
}

export default function MapPage() {
  const { authed, logout } = useAuth();
  const [companies, setCompanies] = useState<Company[]>(() => loadCompanies());
  const [selId, setSelId] = useState<string>(() => loadCompanies()[0]?.id ?? "");
  const [editMode, setEditMode] = useState(false);
  const [addColor, setAddColor] = useState<string>(MARKER_COLORS[0]);
  const [selected, setSelected] = useState<MapMarker | null>(null);
  const [newName, setNewName] = useState("");

  const editing = authed && editMode;

  const selIdRef = useRef(selId);
  selIdRef.current = selId;

  useEffect(() => {
    saveCompanies(companies);
  }, [companies]);

  const company = companies.find((c) => c.id === selId) ?? companies[0];

  const mutate = (id: string, fn: (c: Company) => Company) =>
    setCompanies((prev) => prev.map((c) => (c.id === id ? fn(c) : c)));

  const addMarker = (x: number, y: number) => {
    if (!company) return;
    const m: MapMarker = {
      id: uid("m"),
      color: addColor,
      title: "Нова мітка",
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
    <>
      <PageBanner
        image="/media/banner-map.jpg"
        kicker="Театр дій"
        title="Карта операцій"
        desc="Інтерактивна карта Arma 3 з мітками подій по компаніях. Обирай компанію та переглядай події — деталі відкриваються в картці мітки."
      />

      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-5">
        {authed && (
          <div className="mb-6 flex flex-wrap items-center gap-3">
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
            <button
              onClick={() => {
                logout();
                setEditMode(false);
                setSelected(null);
              }}
              className="label-mono border border-[var(--border)] px-3 py-2 text-[var(--muted-2)] transition-colors hover:border-[var(--danger)] hover:text-[var(--danger)]"
            >
              Вийти
            </button>
          </div>
        )}

        <div className="flex flex-wrap items-center gap-2">
          {companies.map((c) => (
            <button
              key={c.id}
              onClick={() => {
                setSelId(c.id);
                setSelected(null);
              }}
              className="flex items-center gap-2 border px-4 py-2 font-display text-sm font-medium uppercase tracking-wide transition-colors"
              style={{
                borderColor: c.id === selId ? c.color : "var(--border)",
                background: c.id === selId ? "var(--panel)" : "transparent",
              }}
            >
              <span className="h-2.5 w-2.5 rounded-full" style={{ background: c.color }} />
              {c.name}
              <span className="font-mono text-xs text-[var(--muted-2)]">{c.markers.length}</span>
            </button>
          ))}
          {editing && (
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
          <p className="mt-10 text-[var(--muted)]">Компаній ще немає.</p>
        ) : (
          <div className={editing ? "mt-6 grid gap-5 lg:grid-cols-[1fr_320px]" : "mt-6"}>
            <div className="relative h-[480px] overflow-hidden border border-[var(--border)] md:h-[620px]">
              <ArmaMap
                company={company}
                editMode={editing}
                addColor={editing ? addColor : null}
                onAddMarker={addMarker}
                onMarkerClick={onMarkerClick}
                onMarkerMove={onMarkerMove}
              />
            </div>

            {editing && (
              <aside className="space-y-6 border border-[var(--border)] bg-[var(--panel)] p-5">
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
                    <Field label="Колір вкладки">
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
                  <button onClick={() => deleteCompany(company.id)} className="label-mono text-[var(--danger)]">
                    Видалити компанію
                  </button>
                </section>

                <section className="space-y-2 border-t border-[var(--border-soft)] pt-4">
                  <p className="label-mono">Колір нової мітки — клікни по карті</p>
                  <Swatches value={addColor} onPick={setAddColor} />
                </section>

                {selected && (
                  <section className="space-y-3 border-t border-[var(--border-soft)] pt-4">
                    <p className="label-mono text-[var(--accent)]">Мітка</p>
                    <Field label="Колір">
                      <Swatches value={selected.color} onPick={(c) => updateMarker(selected.id, { color: c })} />
                    </Field>
                    <Field label="Назва">
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
                    <Field label="Фото — URL, по одному на рядок">
                      <textarea
                        value={markerImages(selected).join("\n")}
                        onChange={(e) =>
                          updateMarker(selected.id, {
                            images: e.target.value.split("\n").map((s) => s.trim()).filter(Boolean),
                            image: undefined,
                          })
                        }
                        rows={3}
                        className="input"
                        placeholder="/media/crops/squad.jpg"
                      />
                    </Field>
                    <Field label="Відео — URL, по одному на рядок (mp4 або YouTube)">
                      <textarea
                        value={(selected.videos ?? []).join("\n")}
                        onChange={(e) =>
                          updateMarker(selected.id, {
                            videos: e.target.value.split("\n").map((s) => s.trim()).filter(Boolean),
                          })
                        }
                        rows={2}
                        className="input"
                        placeholder="https://youtu.be/...  або  /media/1007.mp4"
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
                    <button onClick={() => deleteMarker(selected.id)} className="label-mono text-[var(--danger)]">
                      Видалити мітку
                    </button>
                  </section>
                )}

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
                    Зміни локальні. Щоб опублікувати — «Експорт JSON» і заміни ним{" "}
                    <code>src/data/companies.json</code>, потім commit + push.
                  </p>
                </section>
              </aside>
            )}
          </div>
        )}

        {selected && !editing && (
          <div
            className="fixed inset-0 z-[2000] flex items-center justify-center bg-black/70 p-4"
            onClick={() => setSelected(null)}
          >
            <div
              className="w-full max-w-md overflow-hidden rounded-xl border-2 bg-[var(--panel)] shadow-[0_16px_50px_rgba(0,0,0,0.55)]"
              style={{ borderColor: selected.color }}
              onClick={(e) => e.stopPropagation()}
            >
              <MarkerMedia images={markerImages(selected)} videos={markerVideos(selected)} />
              <div className="p-5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="h-3 w-3 rounded-full" style={{ background: selected.color }} />
                    {selected.date && (
                      <span className="font-mono text-xs text-[var(--muted-2)]">{selected.date}</span>
                    )}
                  </div>
                  <button
                    onClick={() => setSelected(null)}
                    className="label-mono hover:text-[var(--text)]"
                    aria-label="Закрити"
                  >
                    ✕
                  </button>
                </div>
                <h3 className="font-display mt-2 text-xl font-semibold uppercase tracking-wide">
                  {selected.title}
                </h3>
                {selected.description && (
                  <p className="mt-3 text-sm leading-relaxed text-[var(--muted)]">{selected.description}</p>
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
    </>
  );
}

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1 block font-mono text-[11px] text-[var(--muted-2)]">{label}</span>
      {children}
    </label>
  );
}

function MarkerMedia({ images, videos }: { images: string[]; videos: string[] }) {
  if (!images.length && !videos.length) return null;
  return (
    <div className="bg-black/30">
      {images.length === 1 && <img src={images[0]} alt="" className="h-48 w-full object-cover" />}
      {images.length > 1 && (
        <Swiper modules={[Navigation, Pagination]} navigation pagination={{ clickable: true }} className="marker-media">
          {images.map((src, i) => (
            <SwiperSlide key={i}>
              <img src={src} alt="" className="h-48 w-full object-cover" />
            </SwiperSlide>
          ))}
        </Swiper>
      )}
      {videos.map((v, i) => (
        <VideoEmbed key={i} url={v} />
      ))}
    </div>
  );
}

function VideoEmbed({ url }: { url: string }) {
  const yt = url.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|shorts\/))([\w-]{11})/);
  if (yt) {
    return (
      <div className="aspect-video w-full">
        <iframe
          className="h-full w-full border-0"
          src={`https://www.youtube.com/embed/${yt[1]}`}
          title="video"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>
    );
  }
  return <video src={url} controls className="w-full" />;
}

import { useCallback, useEffect, useState } from "react";
import { GALLERY_CAPTIONS } from "../data/gallery";

// Vite сам підхопить усі зображення з цієї папки — просто кидай туди файли.
const modules = import.meta.glob("../assets/gallery/*.{jpg,jpeg,png,webp}", {
  eager: true,
  import: "default",
}) as Record<string, string>;

const IMAGES = Object.entries(modules)
  .map(([path, src]) => {
    const name = path.split("/").pop() ?? "";
    return { src, name, caption: GALLERY_CAPTIONS[name] ?? "" };
  })
  .sort((a, b) => a.name.localeCompare(b.name));

export default function GalleryPage() {
  const [index, setIndex] = useState<number | null>(null);
  const open = index !== null;

  const close = useCallback(() => setIndex(null), []);
  const prev = useCallback(
    () => setIndex((i) => (i === null ? i : (i - 1 + IMAGES.length) % IMAGES.length)),
    []
  );
  const next = useCallback(
    () => setIndex((i) => (i === null ? i : (i + 1) % IMAGES.length)),
    []
  );

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      else if (e.key === "ArrowLeft") prev();
      else if (e.key === "ArrowRight") next();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, close, prev, next]);

  return (
    <div className="mx-auto max-w-6xl px-5 py-12">
      <p className="label-mono text-[var(--accent)]">// Медіа</p>
      <h1 className="font-display mt-2 text-4xl font-bold uppercase tracking-tight md:text-5xl">
        Галерея
      </h1>
      <p className="mt-4 max-w-2xl text-[var(--muted)]">
        Скріншоти з операцій Корпусу. Щоб додати — поклади зображення у{" "}
        <code className="font-mono text-[var(--text)]">src/assets/gallery/</code>, підпис
        (за бажанням) — у <code className="font-mono text-[var(--text)]">src/data/gallery.ts</code>.
      </p>

      {IMAGES.length === 0 ? (
        <div className="mt-12 border border-dashed border-[var(--border)] p-12 text-center text-[var(--muted-2)]">
          Поки що порожньо — додай скріншоти у{" "}
          <code className="font-mono">src/assets/gallery/</code>.
        </div>
      ) : (
        <div className="mt-10 grid grid-cols-2 gap-5 md:grid-cols-3">
          {IMAGES.map((img, i) => (
            <button
              key={img.name}
              onClick={() => setIndex(i)}
              className="group relative aspect-[4/3] overflow-hidden rounded-xl border border-[var(--border)]"
            >
              <img
                src={img.src}
                alt={img.caption || img.name}
                loading="lazy"
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              {img.caption && (
                <span className="absolute bottom-3 left-3 rounded-md bg-[rgba(10,13,10,0.78)] px-3 py-1.5 text-sm text-[var(--text)] backdrop-blur">
                  {img.caption}
                </span>
              )}
            </button>
          ))}
        </div>
      )}

      {open && index !== null && (
        <div
          className="fixed inset-0 z-[2000] flex items-center justify-center bg-black/85 p-4 backdrop-blur-sm"
          onClick={close}
        >
          <button
            onClick={close}
            aria-label="Закрити"
            className="absolute right-5 top-5 flex h-11 w-11 items-center justify-center rounded-full border border-white/25 bg-black/40 text-white transition-colors hover:bg-black/70"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M6 6l12 12M18 6L6 18" />
            </svg>
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              prev();
            }}
            aria-label="Назад"
            className="absolute left-4 top-1/2 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border border-white/25 bg-black/40 text-white transition-colors hover:bg-black/70 md:left-8"
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M15 6l-6 6 6 6" />
            </svg>
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              next();
            }}
            aria-label="Далі"
            className="absolute right-4 top-1/2 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border border-white/25 bg-black/40 text-white transition-colors hover:bg-black/70 md:right-8"
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M9 6l6 6-6 6" />
            </svg>
          </button>

          <figure className="flex max-h-[88vh] max-w-[92vw] flex-col items-center" onClick={(e) => e.stopPropagation()}>
            <img
              src={IMAGES[index].src}
              alt={IMAGES[index].caption || IMAGES[index].name}
              className="max-h-[80vh] max-w-full rounded-xl object-contain"
            />
            {IMAGES[index].caption && (
              <figcaption className="mt-4 font-display text-lg uppercase tracking-wide text-white">
                {IMAGES[index].caption}
              </figcaption>
            )}
            <div className="mt-4 flex max-w-full flex-wrap justify-center gap-2">
              {IMAGES.map((img, i) => (
                <button
                  key={img.name}
                  onClick={(e) => {
                    e.stopPropagation();
                    setIndex(i);
                  }}
                  aria-label={`Фото ${i + 1}`}
                  className="h-2.5 w-2.5 rounded-full transition-colors"
                  style={{ background: i === index ? "var(--accent)" : "rgba(255,255,255,0.3)" }}
                />
              ))}
            </div>
          </figure>
        </div>
      )}
    </div>
  );
}

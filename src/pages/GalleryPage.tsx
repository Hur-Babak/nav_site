import { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Keyboard } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { Reveal } from "../components/Reveal";
import { GALLERY_CAPTIONS } from "../data/gallery";

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

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIndex(null);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-5">
      <Reveal>
        <p className="label-mono text-[var(--accent)]">// Медіа</p>
        <h1 className="font-display mt-2 text-3xl font-bold uppercase tracking-tight sm:text-4xl md:text-5xl">
          Галерея
        </h1>
        <p className="mt-4 max-w-2xl text-[var(--muted)]">
          Скріншоти з операцій Корпусу. Щоб додати — поклади зображення у{" "}
          <code className="font-mono text-[var(--text)]">src/assets/gallery/</code>, підпис
          (за бажанням) — у <code className="font-mono text-[var(--text)]">src/data/gallery.ts</code>.
        </p>
      </Reveal>

      {IMAGES.length === 0 ? (
        <div className="mt-12 border border-dashed border-[var(--border)] p-12 text-center text-[var(--muted-2)]">
          Поки що порожньо — додай скріншоти у{" "}
          <code className="font-mono">src/assets/gallery/</code>.
        </div>
      ) : (
        <div className="mt-10 grid grid-cols-2 gap-3 sm:gap-5 md:grid-cols-3">
          {IMAGES.map((img, i) => (
            <Reveal key={img.name} delay={(i % 3) * 0.08}>
              <button
                onClick={() => setIndex(i)}
                className="lift group block w-full overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--panel)] p-1.5 hover:border-[var(--accent)]"
              >
                <div className="relative aspect-[4/3] overflow-hidden rounded-lg">
                  <img
                    src={img.src}
                    alt={img.caption || img.name}
                    loading="lazy"
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  {img.caption && (
                    <span className="absolute bottom-2 left-2 rounded-md bg-[rgba(10,13,10,0.8)] px-2.5 py-1 text-xs text-[var(--text)] backdrop-blur sm:text-sm">
                      {img.caption}
                    </span>
                  )}
                </div>
              </button>
            </Reveal>
          ))}
        </div>
      )}

      {open && index !== null && (
        <div className="fixed inset-0 z-[2000] bg-black/85 backdrop-blur-sm">
          <button
            onClick={() => setIndex(null)}
            aria-label="Закрити"
            className="absolute right-4 top-4 z-10 flex h-11 w-11 items-center justify-center rounded-full border border-white/25 bg-black/40 text-white transition-colors hover:bg-black/70"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M6 6l12 12M18 6L6 18" />
            </svg>
          </button>

          <Swiper
            modules={[Navigation, Pagination, Keyboard]}
            navigation
            pagination={{ clickable: true }}
            keyboard={{ enabled: true }}
            initialSlide={index}
            className="h-full w-full"
          >
            {IMAGES.map((img) => (
              <SwiperSlide key={img.name}>
                <div
                  className="flex h-full items-center justify-center p-6 sm:p-12"
                  onClick={(e) => {
                    if (e.target === e.currentTarget) setIndex(null);
                  }}
                >
                  <figure className="flex max-h-full max-w-full flex-col items-center">
                    <img
                      src={img.src}
                      alt={img.caption || img.name}
                      className="max-h-[78vh] max-w-[88vw] rounded-xl object-contain"
                    />
                    {img.caption && (
                      <figcaption className="mt-4 font-display text-base uppercase tracking-wide text-white sm:text-lg">
                        {img.caption}
                      </figcaption>
                    )}
                  </figure>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      )}
    </div>
  );
}

import { useEffect, useRef, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Keyboard } from "swiper/modules";
import type { Swiper as SwiperClass } from "swiper";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { Reveal } from "../components/Reveal";
import { PageBanner } from "../components/PageBanner";
import { useAuth } from "../components/AuthContext";
import { GALLERY_CAPTIONS } from "../data/gallery";

const modules = import.meta.glob("../assets/gallery/*.{jpg,jpeg,png,webp}", {
  eager: true,
  import: "default",
}) as Record<string, string>;

const BUNDLED = Object.entries(modules)
  .map(([path, src]) => {
    const name = path.split("/").pop() ?? "";
    return { key: name, src, caption: GALLERY_CAPTIONS[name] ?? "" };
  })
  .sort((a, b) => a.key.localeCompare(b.key));

const UKEY = "nav.gallery.user.v1";
interface UserImg {
  id: string;
  src: string;
  caption: string;
}
function loadUser(): UserImg[] {
  try {
    const r = localStorage.getItem(UKEY);
    if (r) return JSON.parse(r) as UserImg[];
  } catch {
    /* ignore */
  }
  return [];
}

interface Item {
  key: string;
  src: string;
  caption: string;
  userId?: string;
}

export default function GalleryPage() {
  const { authed } = useAuth();
  const [userImgs, setUserImgs] = useState<UserImg[]>(() => loadUser());
  const [index, setIndex] = useState<number | null>(null);
  const open = index !== null;
  const prevRef = useRef<HTMLButtonElement>(null);
  const nextRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    try {
      localStorage.setItem(UKEY, JSON.stringify(userImgs));
    } catch {
      alert("Локальне сховище переповнене — зменш кількість або розмір зображень.");
    }
  }, [userImgs]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIndex(null);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const items: Item[] = [
    ...BUNDLED.map((b) => ({ key: b.key, src: b.src, caption: b.caption })),
    ...userImgs.map((u) => ({ key: u.id, src: u.src, caption: u.caption, userId: u.id })),
  ];

  const onUpload = (files: FileList | null) => {
    if (!files) return;
    Promise.all(
      Array.from(files).map(
        (f) =>
          new Promise<UserImg>((res, rej) => {
            const r = new FileReader();
            r.onload = () =>
              res({
                id: "u_" + Math.random().toString(36).slice(2, 9),
                src: String(r.result),
                caption: f.name.replace(/\.[^.]+$/, ""),
              });
            r.onerror = () => rej(new Error("read"));
            r.readAsDataURL(f);
          })
      )
    )
      .then((imgs) => setUserImgs((prev) => [...prev, ...imgs]))
      .catch(() => alert("Помилка читання файлів"));
  };

  const removeUser = (id: string) => setUserImgs((prev) => prev.filter((u) => u.id !== id));

  return (
    <>
      <PageBanner
        image="/media/crops/squad.jpg"
        kicker="Медіа"
        title="Галерея"
        desc="Скріншоти з операцій Корпусу. Гортай свайпом або стрілками, клік — велике фото."
      />

      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-5">
        {authed && (
          <div className="mb-6 flex flex-wrap items-center gap-3">
            <label className="label-mono cursor-pointer border border-[var(--accent-2)] px-4 py-2 text-[var(--accent-2)]">
              + Завантажити зображення
              <input
                type="file"
                accept="image/*"
                multiple
                className="hidden"
                onChange={(e) => {
                  onUpload(e.target.files);
                  e.target.value = "";
                }}
              />
            </label>
            <span className="font-mono text-[11px] text-[var(--muted-2)]">
              зберігається у твоєму браузері; для постійної публікації клади файли в
              src/assets/gallery/
            </span>
          </div>
        )}

        {items.length === 0 ? (
          <div className="border border-dashed border-[var(--border)] p-12 text-center text-[var(--muted-2)]">
            Поки що порожньо.
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3 sm:gap-5 md:grid-cols-3">
            {items.map((img, i) => (
              <Reveal key={img.key} delay={(i % 3) * 0.08}>
                <div className="relative">
                  <button
                    onClick={() => setIndex(i)}
                    className="lift group block w-full cursor-pointer overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--panel)] p-1.5 hover:border-[var(--accent)]"
                  >
                    <div className="relative aspect-[4/3] overflow-hidden rounded-lg">
                      <img
                        src={img.src}
                        alt={img.caption || img.key}
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
                  {authed && img.userId && (
                    <button
                      onClick={() => removeUser(img.userId as string)}
                      aria-label="Видалити"
                      className="absolute right-3 top-3 flex h-7 w-7 items-center justify-center rounded-full bg-black/60 text-white transition-colors hover:bg-[var(--danger)]"
                    >
                      ✕
                    </button>
                  )}
                </div>
              </Reveal>
            ))}
          </div>
        )}
      </div>

      {open && index !== null && (
        <div
          className="fixed inset-0 z-[2000] bg-black/85 backdrop-blur-sm"
          onClick={(e) => {
            if (e.target === e.currentTarget) setIndex(null);
          }}
        >
          <button
            onClick={() => setIndex(null)}
            aria-label="Закрити"
            className="absolute right-4 top-4 z-20 flex h-11 w-11 items-center justify-center rounded-full border border-white/25 bg-black/40 text-white transition-colors hover:bg-black/70"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M6 6l12 12M18 6L6 18" />
            </svg>
          </button>

          <div className="relative mx-auto flex h-full w-full max-w-[1000px] items-center">
            <button
              ref={prevRef}
              aria-label="Назад"
              className="absolute left-1 top-1/2 z-20 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/25 bg-black/40 text-white transition-colors hover:bg-black/70"
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M15 6l-6 6 6 6" />
              </svg>
            </button>
            <button
              ref={nextRef}
              aria-label="Далі"
              className="absolute right-1 top-1/2 z-20 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/25 bg-black/40 text-white transition-colors hover:bg-black/70"
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M9 6l6 6-6 6" />
              </svg>
            </button>

            <Swiper
              modules={[Navigation, Pagination, Keyboard]}
              navigation={{ prevEl: prevRef.current, nextEl: nextRef.current }}
              onBeforeInit={(s: SwiperClass) => {
                const nav = s.params.navigation;
                if (nav && typeof nav !== "boolean") {
                  nav.prevEl = prevRef.current;
                  nav.nextEl = nextRef.current;
                }
              }}
              pagination={{ clickable: true }}
              keyboard
              initialSlide={index}
              className="h-full w-full"
            >
              {items.map((img) => (
                <SwiperSlide key={img.key}>
                  <div
                    className="flex h-full items-center justify-center px-14 py-10"
                    onClick={(e) => {
                      if (e.target === e.currentTarget) setIndex(null);
                    }}
                  >
                    <figure className="w-full max-w-[920px]">
                      <div className="aspect-video w-full overflow-hidden rounded-xl border border-white/15 bg-black/40">
                        <img
                          src={img.src}
                          alt={img.caption || img.key}
                          className="h-full w-full object-cover"
                        />
                      </div>
                      {img.caption && (
                        <figcaption className="mt-4 text-center font-display text-base uppercase tracking-wide text-white sm:text-lg">
                          {img.caption}
                        </figcaption>
                      )}
                    </figure>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        </div>
      )}
    </>
  );
}

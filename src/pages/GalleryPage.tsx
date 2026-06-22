import { useState } from "react";

// Vite сам підхопить усі зображення з цієї папки — просто кидай туди файли.
const modules = import.meta.glob("../assets/gallery/*.{jpg,jpeg,png,webp}", {
  eager: true,
  import: "default",
}) as Record<string, string>;

const IMAGES = Object.entries(modules)
  .map(([path, src]) => ({ src, name: path.split("/").pop() ?? "" }))
  .sort((a, b) => a.name.localeCompare(b.name));

export default function GalleryPage() {
  const [active, setActive] = useState<string | null>(null);

  return (
    <div className="mx-auto max-w-6xl px-5 py-12">
      <p className="label-mono text-[var(--accent)]">// Медіа</p>
      <h1 className="font-display mt-2 text-4xl font-bold uppercase tracking-tight md:text-5xl">
        Галерея
      </h1>
      <p className="mt-4 max-w-2xl text-[var(--muted)]">
        Скріншоти з операцій Корпусу. Щоб додати — поклади зображення у папку{" "}
        <code className="font-mono text-[var(--text)]">src/assets/gallery/</code>,
        commit + push: вони зʼявляться тут автоматично.
      </p>

      {IMAGES.length === 0 ? (
        <div className="mt-12 border border-dashed border-[var(--border)] p-12 text-center text-[var(--muted-2)]">
          Поки що порожньо — додай скріншоти у{" "}
          <code className="font-mono">src/assets/gallery/</code>.
        </div>
      ) : (
        <div className="mt-10 grid grid-cols-2 gap-3 md:grid-cols-3">
          {IMAGES.map((img) => (
            <button
              key={img.name}
              onClick={() => setActive(img.src)}
              className="group relative aspect-video overflow-hidden border border-[var(--border)]"
            >
              <img
                src={img.src}
                alt={img.name}
                loading="lazy"
                className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
            </button>
          ))}
        </div>
      )}

      {active && (
        <div
          className="fixed inset-0 z-[2000] flex items-center justify-center bg-black/85 p-4"
          onClick={() => setActive(null)}
        >
          <img
            src={active}
            alt=""
            className="max-h-[90vh] max-w-full border border-[var(--border)] object-contain"
          />
        </div>
      )}
    </div>
  );
}

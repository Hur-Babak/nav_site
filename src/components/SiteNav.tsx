import { CorpsEmblem } from "./Emblems";

const LINKS = [
  { href: "#units", label: "Підрозділи" },
  { href: "#map", label: "Карта конфлікту" },
  { href: "#structure", label: "Структура" },
  { href: "#join", label: "Набір" },
];

export function SiteNav() {
  return (
    <header className="sticky top-0 z-[1000] border-b border-[var(--border)] bg-[rgba(10,13,10,0.82)] backdrop-blur">
      <nav className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5">
        <a href="#top" className="flex items-center gap-3">
          <CorpsEmblem size={36} />
          <span className="font-display text-lg font-semibold tracking-wide">
            КОРПУС <span className="text-[var(--accent)]">НАВ</span>
          </span>
        </a>
        <div className="hidden items-center gap-7 md:flex">
          {LINKS.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="label-mono transition-colors hover:text-[var(--text)]"
            >
              {l.label}
            </a>
          ))}
        </div>
        <a
          href="#join"
          className="font-display text-sm font-semibold uppercase tracking-wider border border-[var(--accent)] px-4 py-2 text-[var(--accent)] transition-colors hover:bg-[var(--accent)] hover:text-black"
        >
          Вступити
        </a>
      </nav>
    </header>
  );
}

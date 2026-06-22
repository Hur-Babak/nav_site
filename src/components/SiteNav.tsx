import { Link, NavLink } from "react-router-dom";
import { CorpsEmblem } from "./Emblems";

export const DISCORD_URL = "https://discord.gg/6vwq5ApFdq";

const LINKS = [
  { to: "/", label: "Головна" },
  { to: "/map", label: "Карта" },
  { to: "/gallery", label: "Галерея" },
];

export function SiteNav() {
  return (
    <header className="sticky top-0 z-[1000] border-b border-[var(--border)] bg-[rgba(10,13,10,0.82)] backdrop-blur">
      <nav className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5">
        <Link to="/" className="flex items-center gap-3">
          <CorpsEmblem size={36} />
          <span className="font-display text-lg font-semibold tracking-wide">
            КОРПУС <span className="text-[var(--accent)]">НАВ</span>
          </span>
        </Link>
        <div className="hidden items-center gap-7 md:flex">
          {LINKS.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              end={l.to === "/"}
              className="label-mono transition-colors hover:text-[var(--text)]"
              style={({ isActive }) => ({ color: isActive ? "var(--text)" : undefined })}
            >
              {l.label}
            </NavLink>
          ))}
        </div>
        <a
          href={DISCORD_URL}
          target="_blank"
          rel="noreferrer"
          className="font-display text-sm font-semibold uppercase tracking-wider border border-[var(--accent)] px-4 py-2 text-[var(--accent)] transition-colors hover:bg-[var(--accent)] hover:text-black"
        >
          Вступити
        </a>
      </nav>
    </header>
  );
}

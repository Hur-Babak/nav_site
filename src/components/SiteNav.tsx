import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { CorpsEmblem } from "./Emblems";

export const DISCORD_URL = "https://discord.gg/6vwq5ApFdq";

const LINKS = [
  { to: "/", label: "Головна" },
  { to: "/map", label: "Карта" },
  { to: "/gallery", label: "Галерея" },
];

export function SiteNav() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-[1200] border-b border-[var(--border)] bg-[rgba(10,13,10,0.92)] backdrop-blur">
      <nav className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-5">
        <Link to="/" onClick={() => setOpen(false)} className="flex items-center gap-2.5">
          <CorpsEmblem size={34} />
          <span className="font-display text-base font-semibold tracking-wide sm:text-lg">
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
          className="hidden border border-[var(--accent)] px-4 py-2 font-display text-sm font-semibold uppercase tracking-wider text-[var(--accent)] transition-colors hover:bg-[var(--accent)] hover:text-black active:scale-95 md:inline-flex"
        >
          Вступити
        </a>

        <button
          onClick={() => setOpen((o) => !o)}
          aria-label="Меню"
          aria-expanded={open}
          className="flex h-10 w-10 items-center justify-center text-[var(--text)] md:hidden"
        >
          {open ? (
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M6 6l12 12M18 6L6 18" />
            </svg>
          ) : (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M4 7h16M4 12h16M4 17h16" />
            </svg>
          )}
        </button>
      </nav>

      {open && (
        <div className="border-t border-[var(--border)] bg-[var(--bg)] md:hidden">
          <div className="mx-auto flex max-w-6xl flex-col px-4 py-2">
            {LINKS.map((l) => (
              <NavLink
                key={l.to}
                to={l.to}
                end={l.to === "/"}
                onClick={() => setOpen(false)}
                className="label-mono py-3 transition-colors hover:text-[var(--text)]"
                style={({ isActive }) => ({ color: isActive ? "var(--text)" : undefined })}
              >
                {l.label}
              </NavLink>
            ))}
            <a
              href={DISCORD_URL}
              target="_blank"
              rel="noreferrer"
              onClick={() => setOpen(false)}
              className="my-2 inline-flex justify-center border border-[var(--accent)] px-4 py-3 font-display text-sm font-semibold uppercase tracking-wider text-[var(--accent)]"
            >
              Вступити
            </a>
          </div>
        </div>
      )}
    </header>
  );
}

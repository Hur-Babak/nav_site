import { SectionHead } from "./Units";
import { DISCORD_URL } from "./SiteNav";

const REQUIREMENTS = [
  "Вік від 16 років і робочий мікрофон",
  "Ліцензійна Arma 3 та стабільне з'єднання",
  "Готовність вчитися й дотримуватися дисципліни",
  "Адекватність і командна гра — головне",
];

export function Recruitment() {
  return (
    <section id="join" className="mx-auto max-w-6xl px-5 py-24">
      <div className="grid gap-10 md:grid-cols-2">
        <div>
          <SectionHead
            kicker="Набір до лав"
            title="Вступ до Корпусу"
            desc="Набір відкрито в усі підрозділи — обирай напрямок (TFEW, CCO P.U.M.A. чи ION). Кожен новобранець проходить підготовку поруч із досвідченими бійцями."
          />
          <ul className="mt-8 space-y-3">
            {REQUIREMENTS.map((r) => (
              <li key={r} className="flex items-start gap-3 text-[var(--muted)]">
                <span className="mt-2 h-1.5 w-1.5 shrink-0 bg-[var(--accent)]" />
                <span>{r}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="flex flex-col justify-between border border-[var(--border)] bg-[var(--panel)] p-8">
          <div>
            <p className="label-mono text-[var(--accent-2)]">Канал зв'язку</p>
            <p className="mt-3 font-display text-2xl font-semibold">
              Discord Корпусу
            </p>
            <p className="mt-3 text-sm leading-relaxed text-[var(--muted)]">
              Запис на операції, брифінги та статистика посідань ведуться через
              нашого бота. Долучайся — і отримаєш доступ до найближчих виходів.
            </p>
          </div>
          <div className="mt-8 space-y-3">
            <a
              href={DISCORD_URL}
              target="_blank"
              rel="noreferrer"
              className="flex items-center justify-center bg-[var(--accent)] px-6 py-4 font-display text-base font-semibold uppercase tracking-wider text-black transition-opacity hover:opacity-90"
            >
              Приєднатися в Discord
            </a>
            <p className="text-center font-mono text-xs text-[var(--muted-2)]">
              discord.gg/6vwq5ApFdq
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

export function Footer() {
  return (
    <footer className="border-t border-[var(--border)] bg-[var(--bg-soft)]">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-5 py-10 md:flex-row">
        <p className="font-display text-sm font-semibold uppercase tracking-wider">
          Корпус <span className="text-[var(--accent)]">НАВ</span>
        </p>
        <p className="font-mono text-xs text-[var(--muted-2)]">
          Freelancer Times · THE UNREGISTERED · {new Date().getFullYear()}
        </p>
      </div>
    </footer>
  );
}

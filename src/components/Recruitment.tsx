import { SectionHead } from "./Units";
import { DISCORD_URL } from "./SiteNav";
import { Reveal } from "./Reveal";
import { useAuth } from "./AuthContext";

const STEPS = [
  "Подати заявку в Discord Корпусу",
  "Коротка співбесіда зі складом",
  "Курс базової підготовки",
  "Призначення до підрозділу",
];

export function Recruitment() {
  return (
    <section id="join" className="mx-auto max-w-6xl px-4 py-20 sm:px-5 sm:py-24">
      <div className="grid gap-10 md:grid-cols-2">
        <Reveal>
          <div>
            <SectionHead
              kicker="Набір до лав"
              title="Вступ до Корпусу"
              desc="Двері Корпусу відкриті для кожного, хто готовий стати в стрій. Досвід гри не обов'язковий — усьому навчимо на курсі базової підготовки. Обирай напрямок: TFEW, CCO P.U.M.A. чи ION."
            />
            <ol className="mt-8 space-y-3">
              {STEPS.map((s, i) => (
                <li key={s} className="flex items-start gap-3 text-[var(--muted)]">
                  <span className="font-mono text-sm text-[var(--accent)]">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span>{s}</span>
                </li>
              ))}
            </ol>
          </div>
        </Reveal>

        <Reveal delay={0.1}>
          <div className="flex h-full flex-col justify-between border border-[var(--border)] bg-[var(--panel)] p-8">
            <div>
              <p className="label-mono text-[var(--accent-2)]">Канал зв'язку</p>
              <p className="mt-3 font-display text-2xl font-semibold">Discord Корпусу</p>
              <p className="mt-3 text-sm leading-relaxed text-[var(--muted)]">
                Запис на операції, брифінги та підготовка ведуться через наш Discord.
                Долучайся — і отримаєш доступ до найближчих виходів.
              </p>
            </div>
            <div className="mt-8 space-y-3">
              <a
                href={DISCORD_URL}
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-center bg-[var(--accent)] px-6 py-4 font-display text-base font-semibold uppercase tracking-wider text-black transition-all hover:opacity-90 active:scale-95"
              >
                Приєднатися в Discord
              </a>
              <p className="text-center font-mono text-xs text-[var(--muted-2)]">
                discord.gg/6vwq5ApFdq
              </p>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

export function Footer() {
  const { openLogin } = useAuth();
  return (
    <footer className="border-t border-[var(--border)]">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-4 py-10 sm:px-5 md:flex-row">
        <p className="font-display text-sm font-semibold uppercase tracking-wider">
          Корпус <span className="text-[var(--accent)]">НАВ</span>
        </p>
        <p className="font-mono text-xs text-[var(--muted-2)]">
          Freelancer Times · THE UNREGISTERED ·{" "}
          {/* Прихований вхід: клік по року відкриває авторизацію */}
          <button
            onClick={openLogin}
            aria-label="Вхід"
            className="cursor-default text-[var(--muted-2)] outline-none"
          >
            {new Date().getFullYear()}
          </button>
        </p>
      </div>
    </footer>
  );
}

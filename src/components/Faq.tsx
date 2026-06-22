import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Reveal } from "./Reveal";
import { SectionHead } from "./Units";

const FAQ = [
  {
    q: "Чи потрібен досвід гри в Arma 3 для вступу?",
    a: "Ні. Ми навчаємо новобранців усім необхідним навичкам під час курсу базової підготовки.",
  },
  {
    q: "Скільки років потрібно для вступу до корпусу?",
    a: "Великої різниці немає — якщо ви врівноважена та спокійна людина, вік не впливає.",
  },
  {
    q: "Які модифікації потрібно встановити для гри?",
    a: "Повний список модифікацій та інструкцію зі встановлення ви отримаєте після вступу на сервер.",
  },
  {
    q: "Як проходить вступ до корпусу?",
    a: "Після подачі заявки ви проходите коротку співбесіду, курс базової підготовки та отримуєте призначення до підрозділу.",
  },
];

export function Faq() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section id="faq" className="border-y border-[var(--border)]">
      <div className="mx-auto max-w-6xl px-4 py-20 sm:px-5 sm:py-24">
        <Reveal>
          <SectionHead kicker="FAQ" title="Часті питання" />
        </Reveal>
        <div className="mt-10 space-y-3">
          {FAQ.map((item, i) => {
            const isOpen = open === i;
            return (
              <Reveal key={item.q} delay={i * 0.06}>
                <div className="border border-[var(--border)] bg-[var(--panel)] transition-colors hover:border-[var(--muted-2)]">
                  <button
                    onClick={() => setOpen(isOpen ? null : i)}
                    className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left"
                    aria-expanded={isOpen}
                  >
                    <span className="font-display text-base uppercase tracking-wide">{item.q}</span>
                    <span className="shrink-0 text-2xl leading-none text-[var(--accent)]">
                      {isOpen ? "−" : "+"}
                    </span>
                  </button>
                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25, ease: "easeOut" }}
                        className="overflow-hidden"
                      >
                        <p className="px-5 pb-5 text-sm leading-relaxed text-[var(--muted)]">
                          {item.a}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}

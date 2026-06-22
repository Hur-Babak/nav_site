import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { CorpsEmblem } from "./Emblems";

export function Hero() {
  return (
    <section id="top" className="relative grain overflow-hidden border-b border-[var(--border)]">
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: "url(/media/20251014191838_1.jpg)" }}
        aria-hidden
      />
      <video
        className="absolute inset-0 h-full w-full object-cover"
        autoPlay
        muted
        loop
        playsInline
        poster="/media/20251014191838_1.jpg"
        aria-hidden
      >
        <source src="/media/hero.mp4" type="video/mp4" />
      </video>
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(180deg, rgba(10,13,10,0.55) 0%, rgba(10,13,10,0.78) 55%, rgba(10,13,10,0.97) 100%)",
        }}
        aria-hidden
      />
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="relative mx-auto flex max-w-6xl flex-col items-start gap-6 px-4 py-24 sm:px-5 md:py-40"
      >
        <div className="flex items-center gap-4">
          <CorpsEmblem size={56} />
          <div>
            <p className="label-mono">Task Force · UKSF · Classified</p>
            <p className="font-mono text-xs text-[var(--muted-2)]">
              Прибережний сектор · 20.08 — 03.09.2026
            </p>
          </div>
        </div>
        <h1 className="font-display max-w-3xl text-[1.9rem] font-bold uppercase leading-[1.05] tracking-tight sm:text-5xl md:text-7xl">
          Корпус <span className="text-[var(--accent)]">«НАВ»</span>
          <br />
          оперативне командування
        </h1>
        <p className="max-w-xl text-base leading-relaxed text-[var(--muted)] sm:text-lg">
          Спеціальні операції без декларованої належності. Три підрозділи, одна
          мета — зупинити НАПА на узбережжі. Обирай напрямок, дивись карту
          операцій і приєднуйся до лав.
        </p>
        <div className="flex flex-wrap gap-3">
          <Link
            to="/map"
            className="bg-[var(--accent)] px-6 py-3 font-display text-sm font-semibold uppercase tracking-wider text-black transition-all hover:opacity-90 active:scale-95"
          >
            Відкрити карту
          </Link>
          <a
            href="#join"
            className="border border-[var(--border)] px-6 py-3 font-display text-sm font-semibold uppercase tracking-wider text-[var(--text)] transition-all hover:border-[var(--accent)] active:scale-95"
          >
            Приєднатися
          </a>
        </div>
        <div className="mt-6 flex flex-wrap gap-8 border-t border-[var(--border-soft)] pt-6">
          {[
            ["19", "ролей у складі"],
            ["3", "бойові підрозділи"],
            ["100+", "карт Arma в atlas"],
          ].map(([n, l]) => (
            <div key={l}>
              <div className="font-display text-3xl font-bold text-[var(--text)]">{n}</div>
              <div className="label-mono">{l}</div>
            </div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}

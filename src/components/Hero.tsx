import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { CorpsEmblem } from "./Emblems";

export function Hero() {
  return (
    <section
      id="top"
      className="grain relative flex min-h-[100svh] items-center overflow-hidden border-b border-[var(--border)]"
    >
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
            "linear-gradient(180deg, rgba(10,13,10,0.5) 0%, rgba(10,13,10,0.72) 55%, rgba(10,13,10,0.97) 100%)",
        }}
        aria-hidden
      />
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="relative mx-auto flex w-full max-w-6xl flex-col items-start gap-6 px-4 py-24 sm:px-5"
      >
        <div className="flex items-center gap-4">
          <CorpsEmblem size={56} />
          <p className="label-mono">Об'єднаний Корпус НАВ</p>
        </div>
        <h1 className="font-display max-w-3xl text-[1.9rem] font-bold uppercase leading-[1.05] tracking-tight sm:text-5xl md:text-7xl">
          Корпус <span className="text-[var(--accent)]">«НАВ»</span>
          <br />
          оперативне командування
        </h1>
        <p className="max-w-xl text-base leading-relaxed text-[var(--muted)] sm:text-lg">
          Корпус в Arma 3 створений на підставах тактики, дисципліни та поваги.
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
      </motion.div>
    </section>
  );
}

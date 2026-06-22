import { Reveal } from "./Reveal";

export function PageBanner({
  image,
  kicker,
  title,
  desc,
}: {
  image: string;
  kicker: string;
  title: string;
  desc: string;
}) {
  return (
    <section className="relative overflow-hidden border-b border-[var(--border)]">
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${image})` }}
        aria-hidden
      />
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(180deg, rgba(10,13,10,0.55) 0%, rgba(10,13,10,0.9) 100%)",
        }}
        aria-hidden
      />
      <div className="relative mx-auto max-w-6xl px-4 py-14 sm:px-5 sm:py-20">
        <Reveal>
          <p className="label-mono text-[var(--accent)]">// {kicker}</p>
          <h1 className="font-display mt-2 text-3xl font-bold uppercase tracking-tight sm:text-4xl md:text-5xl">
            {title}
          </h1>
          <p className="mt-3 max-w-2xl text-[var(--muted)]">{desc}</p>
        </Reveal>
      </div>
    </section>
  );
}
